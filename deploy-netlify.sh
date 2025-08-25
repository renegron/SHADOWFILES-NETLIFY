#!/bin/bash

# 🚀 Shadow Files Netlify Deployment Helper Script
# This script helps prepare and deploy Shadow Files to Netlify + Railway

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Shadow Files Netlify Deployment Helper${NC}"
echo "========================================"

# Function to log messages
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v yarn &> /dev/null; then
        log_warning "Yarn is not installed. Installing yarn..."
        npm install -g yarn
    fi
    
    log_success "Requirements check completed"
}

# Prepare frontend for deployment
prepare_frontend() {
    log_info "Preparing frontend for Netlify deployment..."
    
    cd frontend
    
    # Install dependencies
    log_info "Installing frontend dependencies..."
    yarn install
    
    # Create production environment file (will be overridden by Netlify)
    cat > .env.production << EOF
REACT_APP_BACKEND_URL=https://your-railway-backend.up.railway.app
REACT_APP_PAYPAL_CLIENT_ID=AWOqOwJKqb94MVbiEuRSDTHD_JxhwF7Fb9wmRrXIsB00uiHagi_gUIf8sKW3DkOkleDhPBQTax3BDJRi
EOF
    
    # Test build
    log_info "Testing frontend build..."
    yarn build
    
    cd ..
    
    log_success "Frontend prepared for Netlify"
}

# Prepare backend for deployment
prepare_backend() {
    log_info "Preparing backend for Railway deployment..."
    
    cd backend
    
    # Create simplified requirements file for deployment
    cp requirements-deploy.txt requirements.txt
    
    # Create .env template
    cat > .env.example << EOF
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/shadow_files
DB_NAME=shadow_files
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
CORS_ORIGINS=https://your-netlify-site.netlify.app
PORT=8000
EOF
    
    cd ..
    
    log_success "Backend prepared for Railway"
}

# Create deployment files
create_deployment_files() {
    log_info "Creating deployment configuration files..."
    
    # These files are already created, just verify they exist
    if [[ -f "netlify.toml" ]]; then
        log_success "netlify.toml exists"
    else
        log_error "netlify.toml not found"
    fi
    
    if [[ -f "railway.toml" ]]; then
        log_success "railway.toml exists"
    else
        log_error "railway.toml not found"
    fi
    
    if [[ -f "Procfile" ]]; then
        log_success "Procfile exists"
    else
        log_error "Procfile not found"
    fi
}

# Initialize git repository if not exists
setup_git() {
    log_info "Setting up Git repository..."
    
    if [[ ! -d ".git" ]]; then
        git init
        git add .
        git commit -m "Initial commit - Shadow Files ready for deployment"
        log_success "Git repository initialized"
    else
        log_info "Git repository already exists"
        git add .
        git commit -m "Prepared for Netlify deployment" || log_info "No changes to commit"
    fi
}

# Show next steps
show_next_steps() {
    echo ""
    echo -e "${GREEN}🎉 Shadow Files is ready for deployment!${NC}"
    echo "========================================"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo ""
    echo -e "${YELLOW}1. Database Setup (MongoDB Atlas):${NC}"
    echo "   • Go to mongodb.com/atlas"
    echo "   • Create free account and cluster"
    echo "   • Get connection string"
    echo ""
    echo -e "${YELLOW}2. Backend Deployment (Railway):${NC}"
    echo "   • Go to railway.app"
    echo "   • Connect GitHub and deploy from this repo"
    echo "   • Set environment variables in Railway dashboard"
    echo "   • Copy Railway URL when deployed"
    echo ""
    echo -e "${YELLOW}3. Frontend Deployment (Netlify):${NC}"
    echo "   • Go to netlify.com"
    echo "   • Connect GitHub and deploy from this repo"
    echo "   • Set build directory to 'frontend'"
    echo "   • Set environment variables in Netlify dashboard"
    echo ""
    echo -e "${YELLOW}4. Configure CORS:${NC}"
    echo "   • Update CORS_ORIGINS in Railway with your Netlify URL"
    echo ""
    echo -e "${GREEN}📖 Detailed instructions: NETLIFY-DEPLOYMENT-GUIDE.md${NC}"
    echo ""
    echo -e "${BLUE}🚀 Estimated deployment time: 15-20 minutes${NC}"
    echo -e "${BLUE}💰 Cost: FREE (using free tiers)${NC}"
}

# Main function
main() {
    case ${1:-prepare} in
        "prepare")
            check_requirements
            prepare_frontend
            prepare_backend
            create_deployment_files
            setup_git
            show_next_steps
            ;;
        "frontend")
            prepare_frontend
            ;;
        "backend")
            prepare_backend
            ;;
        "git")
            setup_git
            ;;
        *)
            echo "Usage: $0 {prepare|frontend|backend|git}"
            echo ""
            echo "Commands:"
            echo "  prepare  - Prepare everything for deployment (default)"
            echo "  frontend - Prepare frontend only"
            echo "  backend  - Prepare backend only"
            echo "  git      - Setup git repository"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"