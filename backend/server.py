from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from paypalcheckoutsdk.core import SandboxEnvironment, LiveEnvironment
from paypalcheckoutsdk.core import PayPalHttpClient
from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# PayPal Configuration
paypal_client_id = os.environ.get('PAYPAL_CLIENT_ID')
paypal_client_secret = os.environ.get('PAYPAL_CLIENT_SECRET')

# Use Sandbox for development, Live for production
environment = SandboxEnvironment(client_id=paypal_client_id, client_secret=paypal_client_secret)
paypal_client = PayPalHttpClient(environment)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Game Models
class GameSave(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_id: str
    evidence: float = 0
    total_evidence: float = 0
    click_count: int = 0
    upgrades: dict = {}
    achievements: dict = {}
    last_save: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GameSaveCreate(BaseModel):
    player_id: str
    evidence: float = 0
    total_evidence: float = 0
    click_count: int = 0
    upgrades: dict = {}
    achievements: dict = {}

class GameSaveUpdate(BaseModel):
    evidence: Optional[float] = None
    total_evidence: Optional[float] = None
    click_count: Optional[int] = None
    upgrades: Optional[dict] = None
    achievements: Optional[dict] = None

class LeaderboardEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_id: str
    player_name: str
    total_evidence: float
    secrets_unlocked: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeaderboardCreate(BaseModel):
    player_id: str
    player_name: str
    total_evidence: float
    secrets_unlocked: int

# PayPal Payment Models
class PaymentOrder(BaseModel):
    item_id: str
    item_name: str
    amount: float
    currency_code: str = "USD"

class PaymentCapture(BaseModel):
    order_id: str

class PaymentRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_id: str
    item_id: str
    item_name: str
    amount: float
    currency_code: str
    status: str
    player_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Helper function to prepare data for MongoDB
def prepare_for_mongo(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value
    return data

# Game Save Endpoints
@api_router.post("/save", response_model=GameSave)
async def create_game_save(game_save: GameSaveCreate):
    """Create a new game save"""
    save_dict = game_save.dict()
    save_obj = GameSave(**save_dict)
    save_data = prepare_for_mongo(save_obj.dict())
    
    # Check if player already has a save
    existing_save = await db.game_saves.find_one({"player_id": game_save.player_id})
    if existing_save:
        raise HTTPException(status_code=400, detail="Player already has a save game")
    
    await db.game_saves.insert_one(save_data)
    return save_obj

@api_router.get("/save/{player_id}", response_model=GameSave)
async def get_game_save(player_id: str):
    """Get game save for a player"""
    save = await db.game_saves.find_one({"player_id": player_id})
    if not save:
        raise HTTPException(status_code=404, detail="Save game not found")
    return GameSave(**save)

@api_router.put("/save/{player_id}", response_model=GameSave)
async def update_game_save(player_id: str, update_data: GameSaveUpdate):
    """Update game save for a player"""
    existing_save = await db.game_saves.find_one({"player_id": player_id})
    if not existing_save:
        raise HTTPException(status_code=404, detail="Save game not found")
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["last_save"] = datetime.now(timezone.utc)
    
    await db.game_saves.update_one(
        {"player_id": player_id},
        {"$set": prepare_for_mongo(update_dict)}
    )
    
    updated_save = await db.game_saves.find_one({"player_id": player_id})
    return GameSave(**updated_save)

@api_router.delete("/save/{player_id}")
async def delete_game_save(player_id: str):
    """Delete game save for a player"""
    result = await db.game_saves.delete_one({"player_id": player_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Save game not found")
    return {"message": "Save game deleted successfully"}

# Leaderboard Endpoints
@api_router.post("/leaderboard", response_model=LeaderboardEntry)
async def submit_score(entry: LeaderboardCreate):
    """Submit a score to the leaderboard"""
    entry_dict = entry.dict()
    leaderboard_entry = LeaderboardEntry(**entry_dict)
    entry_data = prepare_for_mongo(leaderboard_entry.dict())
    
    # Check if player already has an entry
    existing_entry = await db.leaderboard.find_one({"player_id": entry.player_id})
    if existing_entry:
        # Update if new score is higher
        if entry.total_evidence > existing_entry.get("total_evidence", 0):
            await db.leaderboard.update_one(
                {"player_id": entry.player_id},
                {"$set": entry_data}
            )
            updated_entry = await db.leaderboard.find_one({"player_id": entry.player_id})
            return LeaderboardEntry(**updated_entry)
        else:
            return LeaderboardEntry(**existing_entry)
    else:
        await db.leaderboard.insert_one(entry_data)
        return leaderboard_entry

@api_router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(limit: int = 100):
    """Get top players from leaderboard"""
    entries = await db.leaderboard.find().sort("total_evidence", -1).limit(limit).to_list(limit)
    return [LeaderboardEntry(**entry) for entry in entries]

@api_router.get("/leaderboard/rank/{player_id}")
async def get_player_rank(player_id: str):
    """Get player's rank on the leaderboard"""
    player_entry = await db.leaderboard.find_one({"player_id": player_id})
    if not player_entry:
        raise HTTPException(status_code=404, detail="Player not found on leaderboard")
    
    # Count players with higher scores
    higher_scores = await db.leaderboard.count_documents({
        "total_evidence": {"$gt": player_entry["total_evidence"]}
    })
    
    rank = higher_scores + 1
    total_players = await db.leaderboard.count_documents({})
    
    return {
        "player_id": player_id,
        "rank": rank,
        "total_players": total_players,
        "total_evidence": player_entry["total_evidence"],
        "percentile": round((total_players - rank + 1) / total_players * 100, 2)
    }

# Game Statistics
@api_router.get("/stats/global")
async def get_global_stats():
    """Get global game statistics"""
    total_players = await db.game_saves.count_documents({})
    
    # Aggregate statistics
    pipeline = [
        {
            "$group": {
                "_id": None,
                "total_evidence": {"$sum": "$total_evidence"},
                "total_clicks": {"$sum": "$click_count"},
                "avg_evidence": {"$avg": "$total_evidence"},
                "max_evidence": {"$max": "$total_evidence"}
            }
        }
    ]
    
    result = await db.game_saves.aggregate(pipeline).to_list(1)
    stats = result[0] if result else {
        "total_evidence": 0,
        "total_clicks": 0,
        "avg_evidence": 0,
        "max_evidence": 0
    }
    
    stats["total_players"] = total_players
    stats.pop("_id", None)
    
    return stats

# PayPal Payment Endpoints
@api_router.post("/payments/create-order")
async def create_payment_order(payment_order: PaymentOrder):
    """Create PayPal payment order"""
    try:
        request = OrdersCreateRequest()
        request.prefer('return=representation')
        
        request.request_body = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "reference_id": payment_order.item_id,
                "description": payment_order.item_name,
                "amount": {
                    "currency_code": payment_order.currency_code,
                    "value": f"{payment_order.amount:.2f}"
                }
            }],
            "application_context": {
                "brand_name": "Shadow Files",
                "landing_page": "BILLING",
                "user_action": "PAY_NOW",
                "return_url": "https://clicker-mysteries.preview.emergentagent.com/payment-success",
                "cancel_url": "https://clicker-mysteries.preview.emergentagent.com/payment-cancel"
            }
        }
        
        response = paypal_client.execute(request)
        
        # Store payment record
        payment_record = PaymentRecord(
            order_id=response.result.id,
            item_id=payment_order.item_id,
            item_name=payment_order.item_name,
            amount=payment_order.amount,
            currency_code=payment_order.currency_code,
            status=response.result.status
        )
        
        await db.payments.insert_one(prepare_for_mongo(payment_record.dict()))
        
        return {
            "order_id": response.result.id,
            "status": response.result.status,
            "links": response.result.links
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment order creation failed: {str(e)}")

@api_router.post("/payments/capture-order")
async def capture_payment_order(payment_capture: PaymentCapture):
    """Capture PayPal payment order"""
    try:
        request = OrdersCaptureRequest(payment_capture.order_id)
        response = paypal_client.execute(request)
        
        # Update payment record
        await db.payments.update_one(
            {"order_id": payment_capture.order_id},
            {"$set": {
                "status": response.result.status,
                "timestamp": datetime.now(timezone.utc)
            }}
        )
        
        return {
            "order_id": response.result.id,
            "status": response.result.status,
            "purchase_units": response.result.purchase_units
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment capture failed: {str(e)}")

@api_router.get("/payments/verify/{order_id}")
async def verify_payment(order_id: str):
    """Verify payment status"""
    payment = await db.payments.find_one({"order_id": order_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return {
        "order_id": order_id,
        "item_id": payment["item_id"],
        "status": payment["status"],
        "verified": payment.get("status") == "COMPLETED"
    }

# Basic health check
@api_router.get("/")
async def root():
    return {"message": "Shadow Files API is running", "status": "operational"}

@api_router.get("/health")
async def health_check():
    try:
        # Test database connection
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()