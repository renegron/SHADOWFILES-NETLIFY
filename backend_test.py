import requests
import sys
import json
from datetime import datetime
import uuid

class ConspiracyClickerAPITester:
    def __init__(self, base_url="https://conspiracy-clicker.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_player_id = f"test_player_{uuid.uuid4().hex[:8]}"

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text and response.status_code < 500 else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test basic health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_create_game_save(self):
        """Test creating a new game save"""
        save_data = {
            "player_id": self.test_player_id,
            "evidence": 150.5,
            "total_evidence": 500.0,
            "click_count": 75,
            "upgrades": {"magnifying_glass": 2, "surveillance_camera": 1},
            "achievements": {"first_click": True, "hundred_clicks": False}
        }
        success, response = self.run_test(
            "Create Game Save",
            "POST",
            "save",
            200,
            data=save_data
        )
        return success, response

    def test_get_game_save(self):
        """Test retrieving a game save"""
        success, response = self.run_test(
            "Get Game Save",
            "GET",
            f"save/{self.test_player_id}",
            200
        )
        return success, response

    def test_update_game_save(self):
        """Test updating a game save"""
        update_data = {
            "evidence": 250.0,
            "total_evidence": 750.0,
            "click_count": 100,
            "upgrades": {"magnifying_glass": 3, "surveillance_camera": 2}
        }
        success, response = self.run_test(
            "Update Game Save",
            "PUT",
            f"save/{self.test_player_id}",
            200,
            data=update_data
        )
        return success, response

    def test_submit_leaderboard_score(self):
        """Test submitting a score to leaderboard"""
        leaderboard_data = {
            "player_id": self.test_player_id,
            "player_name": f"TestPlayer_{self.test_player_id[:8]}",
            "total_evidence": 1500.0,
            "secrets_unlocked": 1
        }
        success, response = self.run_test(
            "Submit Leaderboard Score",
            "POST",
            "leaderboard",
            200,
            data=leaderboard_data
        )
        return success, response

    def test_get_leaderboard(self):
        """Test getting leaderboard"""
        success, response = self.run_test(
            "Get Leaderboard",
            "GET",
            "leaderboard",
            200,
            params={"limit": 10}
        )
        return success, response

    def test_get_player_rank(self):
        """Test getting player rank"""
        success, response = self.run_test(
            "Get Player Rank",
            "GET",
            f"leaderboard/rank/{self.test_player_id}",
            200
        )
        return success, response

    def test_get_global_stats(self):
        """Test getting global statistics"""
        success, response = self.run_test(
            "Get Global Stats",
            "GET",
            "stats/global",
            200
        )
        return success, response

    def test_delete_game_save(self):
        """Test deleting a game save"""
        success, response = self.run_test(
            "Delete Game Save",
            "DELETE",
            f"save/{self.test_player_id}",
            200
        )
        return success, response

    def test_nonexistent_save(self):
        """Test getting non-existent save (should return 404)"""
        fake_player_id = f"nonexistent_{uuid.uuid4().hex[:8]}"
        success, response = self.run_test(
            "Get Non-existent Save",
            "GET",
            f"save/{fake_player_id}",
            404
        )
        return success, response

def main():
    print("🎮 Starting Conspiracy Clicker API Tests")
    print("=" * 50)
    
    tester = ConspiracyClickerAPITester()
    
    # Test sequence
    print("\n📡 Testing Basic Endpoints...")
    tester.test_health_check()
    tester.test_root_endpoint()
    
    print("\n💾 Testing Game Save Operations...")
    create_success, create_response = tester.test_create_game_save()
    
    if create_success:
        tester.test_get_game_save()
        tester.test_update_game_save()
        
        print("\n🏆 Testing Leaderboard Operations...")
        tester.test_submit_leaderboard_score()
        tester.test_get_leaderboard()
        tester.test_get_player_rank()
        
        print("\n📊 Testing Statistics...")
        tester.test_get_global_stats()
        
        print("\n🗑️ Testing Cleanup...")
        tester.test_delete_game_save()
    else:
        print("❌ Skipping dependent tests due to save creation failure")
    
    print("\n🔍 Testing Error Cases...")
    tester.test_nonexistent_save()
    
    # Test duplicate save creation (should fail)
    if create_success:
        print("\n🚫 Testing Duplicate Save Creation...")
        tester.run_test(
            "Create Duplicate Save (Should Fail)",
            "POST",
            "save",
            400,
            data={
                "player_id": tester.test_player_id,
                "evidence": 0,
                "total_evidence": 0,
                "click_count": 0
            }
        )
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! Backend API is working correctly.")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())