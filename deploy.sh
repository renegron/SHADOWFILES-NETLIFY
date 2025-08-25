#!/bin/bash

# 🚀 Shadow Files AWS Deployment Script
# This script deploys Shadow Files to AWS

set -e

echo "🚀 Starting Shadow Files deployment to AWS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_BUCKET="shadow-files-frontend"
BACKEND_ECR_REPO="shadow-files-backend"
CLUSTER_NAME="shadow-files-cluster"
SERVICE_NAME="shadow-files-backend"
DISTRIBUTION_ID=""  # CloudFront distribution ID (set after first setup)

# Functions
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
    exit 1
}

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
    fi
    log_success "AWS CLI found"
}

# Check if AWS credentials are configured
check_aws_credentials() {
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Run 'aws configure' first."
    fi
    log_success "AWS credentials configured"
}

# Build and deploy frontend
deploy_frontend() {
    log_info "Building frontend..."
    
    cd frontend
    
    # Create production environment file
    cat > .env << EOF
REACT_APP_BACKEND_URL=https://api.shadowfiles.com
REACT_APP_PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
EOF
    
    # Build the application
    yarn build || log_error "Frontend build failed"
    log_success "Frontend built successfully"
    
    # Upload to S3
    log_info "Uploading frontend to S3..."
    aws s3 sync build/ s3://${FRONTEND_BUCKET} --delete || log_error "S3 upload failed"
    log_success "Frontend uploaded to S3"
    
    # Invalidate CloudFront cache
    if [ ! -z "$DISTRIBUTION_ID" ]; then
        log_info "Invalidating CloudFront cache..."
        aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*" || log_warning "CloudFront invalidation failed"
        log_success "CloudFront cache invalidated"
    else
        log_warning "CloudFront distribution ID not set. Skipping cache invalidation."
    fi
    
    cd ..
}

# Build and deploy backend
deploy_backend() {
    log_info "Building and deploying backend..."
    
    # Get ECR login
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com || log_error "ECR login failed"
    
    # Build Docker image
    docker build -f Dockerfile.backend -t ${BACKEND_ECR_REPO} . || log_error "Backend build failed"
    log_success "Backend Docker image built"
    
    # Tag and push to ECR
    ECR_URI=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/${BACKEND_ECR_REPO}:latest
    docker tag ${BACKEND_ECR_REPO}:latest ${ECR_URI}
    docker push ${ECR_URI} || log_error "ECR push failed"
    log_success "Backend image pushed to ECR"
    
    # Update ECS service
    log_info "Updating ECS service..."
    aws ecs update-service --cluster ${CLUSTER_NAME} --service ${SERVICE_NAME} --force-new-deployment || log_error "ECS service update failed"
    log_success "ECS service updated"
}

# Setup AWS infrastructure (first-time only)
setup_infrastructure() {
    log_info "Setting up AWS infrastructure..."
    
    # Create S3 bucket for frontend
    aws s3 mb s3://${FRONTEND_BUCKET} || log_warning "S3 bucket already exists or creation failed"
    
    # Configure S3 for static website hosting
    aws s3 website s3://${FRONTEND_BUCKET} --index-document index.html --error-document index.html || log_warning "S3 website configuration failed"
    
    # Create ECR repository for backend
    aws ecr create-repository --repository-name ${BACKEND_ECR_REPO} || log_warning "ECR repository already exists or creation failed"
    
    log_success "Infrastructure setup completed (check warnings above)"
}

# Health check
health_check() {
    log_info "Performing health checks..."
    
    # Check if S3 bucket exists
    if aws s3 ls s3://${FRONTEND_BUCKET} &> /dev/null; then
        log_success "Frontend S3 bucket is accessible"
    else
        log_error "Frontend S3 bucket is not accessible"
    fi
    
    # Check if ECR repository exists
    if aws ecr describe-repositories --repository-names ${BACKEND_ECR_REPO} &> /dev/null; then
        log_success "Backend ECR repository exists"
    else
        log_error "Backend ECR repository does not exist"
    fi
}

# Main deployment function
main() {
    log_info "Shadow Files AWS Deployment Started"
    
    # Pre-flight checks
    check_aws_cli
    check_aws_credentials
    
    # Parse command line arguments
    case ${1:-deploy} in
        "setup")
            setup_infrastructure
            ;;
        "frontend")
            deploy_frontend
            ;;
        "backend")
            deploy_backend
            ;;
        "deploy")
            health_check
            deploy_frontend
            deploy_backend
            ;;
        "health")
            health_check
            ;;
        *)
            echo "Usage: $0 {setup|frontend|backend|deploy|health}"
            echo ""
            echo "Commands:"
            echo "  setup    - Set up AWS infrastructure (first-time only)"
            echo "  frontend - Deploy frontend only"
            echo "  backend  - Deploy backend only"
            echo "  deploy   - Deploy both frontend and backend (default)"
            echo "  health   - Check deployment health"
            exit 1
            ;;
    esac
    
    log_success "Deployment completed successfully! 🎉"
    log_info "Your Shadow Files game should be available shortly."
}

# Run main function
main "$@"