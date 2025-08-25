# 🚀 **Shadow Files AWS Deployment - Complete Guide**

## **🎯 Quick Start (Recommended)**

### **Option 1: Simple EC2 Deployment (Fastest)**

**1. Launch EC2 Instance:**
```bash
# Launch t3.medium Ubuntu instance with ports 22, 80, 443, 8001 open
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip
```

**2. Install Docker:**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git
sudo usermod -aG docker ubuntu
sudo systemctl start docker && sudo systemctl enable docker
```

**3. Deploy Shadow Files:**
```bash
# Clone/upload your code
git clone your-repo-url shadow-files
cd shadow-files

# Create environment file
cat > .env << EOF
MONGO_URL=mongodb://mongodb:27017
DB_NAME=shadow_files
PAYPAL_CLIENT_ID=AWOqOwJKqb94MVbiEuRSDTHD_JxhwF7Fb9wmRrXIsB00uiHagi_gUIf8sKW3DkOkleDhPBQTax3BDJRi
PAYPAL_CLIENT_SECRET=EFa3uTWSzcIvEiT2mxi-GvNj4EFZDcONhoF4h4JXCzidOKyCv1PfHfN3ocYS5Qn1nhxUOpmxHxEhRjMO
EOF

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

**4. Access Your Game:**
- **Frontend:** `http://your-ec2-ip`
- **Backend API:** `http://your-ec2-ip:8001/api`

---

## **🏗️ Production AWS Architecture (Recommended)**

### **Step-by-Step Production Deployment**

**1. Set Up AWS CLI:**
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# Configure credentials
aws configure
# Enter: Access Key, Secret Key, Region (us-east-1), Output (json)
```

**2. Deploy Infrastructure with CloudFormation:**
```bash
# Deploy the complete infrastructure
aws cloudformation create-stack \
  --stack-name shadow-files-infrastructure \
  --template-body file://cloudformation-template.yaml \
  --parameters ParameterKey=DomainName,ParameterValue=your-domain.com \
  --capabilities CAPABILITY_IAM

# Wait for completion (10-15 minutes)
aws cloudformation wait stack-create-complete --stack-name shadow-files-infrastructure
```

**3. Deploy Backend to ECS:**
```bash
# Get ECR repository URI
ECR_URI=$(aws cloudformation describe-stacks \
  --stack-name shadow-files-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`ECRRepositoryURI`].OutputValue' \
  --output text)

# Build and push backend
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URI
docker build -f Dockerfile.backend -t shadow-files-backend .
docker tag shadow-files-backend:latest $ECR_URI:latest
docker push $ECR_URI:latest

# Update ECS service
aws ecs update-service \
  --cluster shadow-files-cluster \
  --service shadow-files-backend \
  --force-new-deployment
```

**4. Deploy Frontend to S3:**
```bash
# Get S3 bucket name
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name shadow-files-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' \
  --output text)

# Get ALB DNS for backend URL
ALB_DNS=$(aws cloudformation describe-stacks \
  --stack-name shadow-files-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
  --output text)

# Build frontend with production config
cd frontend
cat > .env << EOF
REACT_APP_BACKEND_URL=http://$ALB_DNS
REACT_APP_PAYPAL_CLIENT_ID=AWOqOwJKqb94MVbiEuRSDTHD_JxhwF7Fb9wmRrXIsB00uiHagi_gUIf8sKW3DkOkleDhPBQTax3BDJRi
EOF

yarn build

# Upload to S3
aws s3 sync build/ s3://$BUCKET_NAME --delete

# Get CloudFront distribution URL
CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
  --stack-name shadow-files-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
  --output text)

echo "🎉 Shadow Files deployed successfully!"
echo "Frontend URL: https://$CLOUDFRONT_URL"
echo "Backend URL: http://$ALB_DNS"
```

---

## **🤖 Automated Deployment**

### **Use the Deployment Script:**
```bash
# Make script executable
chmod +x deploy.sh

# First-time setup
./deploy.sh setup

# Deploy application
./deploy.sh deploy

# Deploy only frontend
./deploy.sh frontend

# Deploy only backend
./deploy.sh backend

# Health check
./deploy.sh health
```

---

## **🔧 Environment Configuration**

### **Required Environment Variables:**

**Backend (.env):**
```bash
MONGO_URL=mongodb://your-documentdb-endpoint:27017/shadow_files
DB_NAME=shadow_files
PAYPAL_CLIENT_ID=AWOqOwJKqb94MVbiEuRSDTHD_JxhwF7Fb9wmRrXIsB00uiHagi_gUIf8sKW3DkOkleDhPBQTax3BDJRi
PAYPAL_CLIENT_SECRET=EFa3uTWSzcIvEiT2mxi-GvNj4EFZDcONhoF4h4JXCzidOKyCv1PfHfN3ocYS5Qn1nhxUOpmxHxEhRjMO
CORS_ORIGINS=https://your-domain.com
```

**Frontend (.env):**
```bash
REACT_APP_BACKEND_URL=https://api.your-domain.com
REACT_APP_PAYPAL_CLIENT_ID=AWOqOwJKqb94MVbiEuRSDTHD_JxhwF7Fb9wmRrXIsB00uiHagi_gUIf8sKW3DkOkleDhPBQTax3BDJRi
```

---

## **💰 Cost Estimates**

### **Simple EC2 Setup:**
- **EC2 t3.medium:** ~$30/month
- **EBS Storage:** ~$3/month
- **Data Transfer:** ~$5-20/month
- **Total:** ~$40-55/month

### **Production AWS Architecture:**
- **ECS Fargate:** ~$25/month
- **DocumentDB t3.medium:** ~$60/month
- **S3 + CloudFront:** ~$5-15/month
- **Application Load Balancer:** ~$18/month
- **Route 53:** ~$1/month
- **Total:** ~$110-120/month

---

## **🛡️ Security Best Practices**

**1. Enable HTTPS:**
```bash
# Add SSL certificate to CloudFront and ALB
aws acm request-certificate --domain-name your-domain.com
```

**2. Set up WAF:**
```bash
# Create WAF for DDoS protection
aws wafv2 create-web-acl --name shadow-files-waf
```

**3. Enable monitoring:**
```bash
# Set up CloudWatch alarms
aws cloudwatch put-metric-alarm --alarm-name "High-CPU" \
  --alarm-description "CPU utilization > 80%" \
  --metric-name CPUUtilization
```

---

## **📊 Monitoring & Maintenance**

### **Health Check URLs:**
- **Frontend:** `https://your-domain.com/health`
- **Backend:** `https://api.your-domain.com/api/health`

### **Log Locations:**
- **ECS Logs:** CloudWatch `/ecs/shadow-files-backend`
- **ALB Logs:** S3 bucket (if enabled)
- **CloudFront Logs:** S3 bucket (if enabled)

### **Backup Strategy:**
- **DocumentDB:** Automated daily backups (7-day retention)
- **S3:** Versioning enabled
- **ECS:** Task definition versions

---

## **🚀 Domain Setup (Optional)**

**1. Register Domain:**
- Use Route 53 or any domain registrar
- Point nameservers to Route 53 (if using Route 53)

**2. Create DNS Records:**
```bash
# Create A record for root domain → CloudFront
aws route53 change-resource-record-sets --hosted-zone-id YOUR-ZONE-ID \
  --change-batch file://dns-records.json

# Create CNAME for api subdomain → ALB
```

**3. SSL Certificate:**
```bash
# Request certificate
aws acm request-certificate \
  --domain-name your-domain.com \
  --subject-alternative-names api.your-domain.com \
  --validation-method DNS
```

---

## **🔄 CI/CD Setup (Advanced)**

### **GitHub Actions Workflow:**
```yaml
# .github/workflows/deploy.yml
name: Deploy Shadow Files
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Deploy
        run: ./deploy.sh deploy
```

---

## **🆘 Troubleshooting**

### **Common Issues:**

**1. ECS Task Fails to Start:**
```bash
# Check ECS service events
aws ecs describe-services --cluster shadow-files-cluster --services shadow-files-backend

# Check CloudWatch logs
aws logs tail /ecs/shadow-files-backend --follow
```

**2. Frontend Not Loading:**
```bash
# Check S3 bucket policy
aws s3api get-bucket-policy --bucket your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR-ID --paths "/*"
```

**3. Database Connection Issues:**
```bash
# Check DocumentDB security groups
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx

# Test connection from ECS task
aws ecs execute-command --cluster shadow-files-cluster --task TASK-ID --interactive --command "/bin/bash"
```

---

## **📞 Support**

**Need help with deployment?**
- Check AWS CloudFormation events for infrastructure issues
- Review ECS service logs in CloudWatch
- Verify security group configurations
- Ensure environment variables are correct

**Common commands for debugging:**
```bash
# Check stack status
aws cloudformation describe-stacks --stack-name shadow-files-infrastructure

# Check ECS service health
aws ecs describe-services --cluster shadow-files-cluster --services shadow-files-backend

# View recent logs
aws logs tail /ecs/shadow-files-backend --since 1h
```

---

## **✅ Deployment Checklist**

- [ ] AWS CLI installed and configured
- [ ] Domain registered (optional)
- [ ] PayPal credentials ready
- [ ] CloudFormation template deployed
- [ ] ECR repository created
- [ ] Backend Docker image built and pushed
- [ ] ECS service running and healthy
- [ ] S3 bucket created and configured
- [ ] Frontend built and uploaded to S3
- [ ] CloudFront distribution created
- [ ] DNS records configured (if using custom domain)
- [ ] SSL certificate requested and validated
- [ ] Health checks passing
- [ ] PayPal payments tested
- [ ] X social links working
- [ ] Game fully functional

**🎉 Congratulations! Shadow Files is now live on AWS!**