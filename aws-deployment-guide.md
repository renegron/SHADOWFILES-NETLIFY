# 🚀 **Shadow Files AWS Deployment Guide**

## **OPTION 1: SIMPLE EC2 DEPLOYMENT** (Recommended for beginners)

### **Step 1: Launch EC2 Instance**

1. **Go to AWS Console → EC2**
2. **Click "Launch Instance"**
3. **Configure:**
   - **Name:** `shadow-files-server`
   - **AMI:** Ubuntu Server 22.04 LTS
   - **Instance Type:** `t3.medium` (2 vCPU, 4GB RAM)
   - **Key Pair:** Create new or select existing
   - **Security Group:** Create new with ports:
     - `22` (SSH)
     - `80` (HTTP)
     - `443` (HTTPS)
     - `8001` (Backend API)
4. **Storage:** 20GB GP3
5. **Launch Instance**

### **Step 2: Connect to EC2 Instance**

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **Step 3: Deploy Application**

```bash
# Clone or upload your code
mkdir shadow-files && cd shadow-files

# Create environment file
cat > .env << EOF
MONGO_URL=mongodb://mongodb:27017
DB_NAME=shadow_files
PAYPAL_CLIENT_ID=AWOqOwJKqb94MVbiEuRSDTHD_JxhwF7Fb9wmRrXIsB00uiHagi_gUIf8sKW3DkOkleDhPBQTax3BDJRi
PAYPAL_CLIENT_SECRET=EFa3uTWSzcIvEiT2mxi-GvNj4EFZDcONhoF4h4JXCzidOKyCv1PfHfN3ocYS5Qn1nhxUOpmxHxEhRjMO
EOF

# Upload your application files (use scp or git)
# Copy: docker-compose.yml, Dockerfile.backend, Dockerfile.frontend, nginx.conf
# Copy: frontend/ and backend/ directories

# Start services
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs
```

---

## **OPTION 2: PRODUCTION AWS ARCHITECTURE** (Recommended for production)

### **Step 1: Set Up Database (DocumentDB)**

1. **Go to AWS Console → DocumentDB**
2. **Create Cluster:**
   - **Cluster Name:** `shadow-files-db`
   - **Instance Class:** `db.t3.medium`
   - **Number of Instances:** 1
   - **Username:** `shadowfiles`
   - **Password:** (secure password)
   - **VPC:** Default or create new
3. **Wait for cluster to be available**
4. **Note the connection string**

### **Step 2: Set Up Backend (ECS + Fargate)**

1. **Create ECR Repository:**
```bash
# Create repository
aws ecr create-repository --repository-name shadow-files-backend

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR-ECR-URL

# Build and push
docker build -f Dockerfile.backend -t shadow-files-backend .
docker tag shadow-files-backend:latest YOUR-ECR-URL/shadow-files-backend:latest
docker push YOUR-ECR-URL/shadow-files-backend:latest
```

2. **Create ECS Cluster:**
   - **Go to ECS → Create Cluster**
   - **Name:** `shadow-files-cluster`
   - **Infrastructure:** AWS Fargate

3. **Create Task Definition:**
   - **Family:** `shadow-files-backend`
   - **Launch Type:** Fargate
   - **CPU:** 512
   - **Memory:** 1024
   - **Container:**
     - **Name:** `backend`
     - **Image:** Your ECR URL
     - **Port:** 8001
     - **Environment Variables:**
       - `MONGO_URL`: DocumentDB connection string
       - `PAYPAL_CLIENT_ID`: Your PayPal ID
       - `PAYPAL_CLIENT_SECRET`: Your PayPal Secret

4. **Create Service:**
   - **Cluster:** `shadow-files-cluster`
   - **Task Definition:** `shadow-files-backend`
   - **Desired Count:** 1
   - **Load Balancer:** Create new ALB

### **Step 3: Set Up Frontend (S3 + CloudFront)**

1. **Build React App:**
```bash
cd frontend
# Update .env for production
echo "REACT_APP_BACKEND_URL=https://api.shadowfiles.com" > .env
echo "REACT_APP_PAYPAL_CLIENT_ID=AWOqOwJKqb94MVbiEuRSDTHD_JxhwF7Fb9wmRrXIsB00uiHagi_gUIf8sKW3DkOkleDhPBQTax3BDJRi" >> .env

yarn build
```

2. **Create S3 Bucket:**
   - **Name:** `shadow-files-frontend` (must be unique)
   - **Region:** us-east-1
   - **Public Access:** Allow (for website hosting)
   - **Static Website Hosting:** Enable
   - **Index Document:** `index.html`

3. **Upload Build Files:**
```bash
aws s3 sync build/ s3://shadow-files-frontend --delete
```

4. **Create CloudFront Distribution:**
   - **Origin:** Your S3 bucket
   - **Viewer Protocol Policy:** Redirect HTTP to HTTPS
   - **Cached HTTP Methods:** GET, HEAD, OPTIONS
   - **Price Class:** Use All Edge Locations
   - **Custom Error Pages:** 
     - **Error Code:** 404
     - **Response Page Path:** `/index.html`
     - **Response Code:** 200

### **Step 4: Set Up Domain & SSL**

1. **Route 53 (if you have a domain):**
   - **Create Hosted Zone** for your domain
   - **Create Records:**
     - `A` record for root domain → CloudFront distribution
     - `CNAME` for `api` subdomain → ALB DNS name

2. **Certificate Manager:**
   - **Request Certificate** for your domain
   - **Add to CloudFront and ALB**

---

## **🔧 DEPLOYMENT SCRIPTS**

### **Quick Deploy Script:**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying Shadow Files to AWS..."

# Build frontend
cd frontend
yarn build
echo "✅ Frontend built"

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete
echo "✅ Frontend uploaded to S3"

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"
echo "✅ CloudFront cache invalidated"

# Update backend (if using ECS)
aws ecs update-service --cluster shadow-files-cluster --service shadow-files-backend --force-new-deployment
echo "✅ Backend service updated"

echo "🎉 Deployment complete!"
```

---

## **💰 ESTIMATED COSTS (Monthly)**

### **Simple EC2 Setup:**
- **EC2 t3.medium:** $30/month
- **EBS Storage:** $3/month
- **Data Transfer:** $5-20/month
- **Total:** ~$40-55/month

### **Production Setup:**
- **ECS Fargate:** $25/month
- **DocumentDB:** $60/month
- **S3 + CloudFront:** $5-15/month
- **ALB:** $18/month
- **Route 53:** $1/month
- **Total:** ~$110-120/month

---

## **🛡️ SECURITY CHECKLIST**

- [ ] Enable HTTPS only
- [ ] Set up WAF for DDoS protection
- [ ] Use IAM roles, not access keys
- [ ] Enable CloudTrail logging
- [ ] Set up monitoring with CloudWatch
- [ ] Configure backup for database
- [ ] Use VPC with private subnets for database
- [ ] Enable GuardDuty for threat detection

---

## **📊 MONITORING & MAINTENANCE**

### **CloudWatch Alarms:**
- CPU utilization > 80%
- Memory utilization > 80%
- Response time > 2 seconds
- Error rate > 5%

### **Backup Strategy:**
- DocumentDB automated backups
- S3 versioning enabled
- ECS task definition versioning

### **Updates:**
- Set up CI/CD with GitHub Actions
- Automated testing pipeline
- Blue-green deployments