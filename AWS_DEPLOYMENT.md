# Manual AWS Deployment Guide for Vastra E-Commerce

This guide provides step-by-step instructions to manually deploy the **Vastra E-Commerce** project (Express Backend + React/Vite Frontend) directly using the **AWS Management Console (Web Dashboard)**.

---

## 📋 Overview of Deployment Architecture

| Component | AWS Service | Hosting Method |
|---|---|---|
| **Frontend** | Amazon S3 | Static Website Hosting + Public Read Policy |
| **Backend API** | AWS Elastic Beanstalk | Node.js Platform (Linux 2023) + ZIP Source Upload |
| **Database** | MongoDB Atlas | Managed Cloud Database |

---

## 📁 PART 1: Prepare Project Files Locally

### 1. Build the Frontend Production Bundle
1. Open terminal in the project directory.
2. Ensure `frontend/.env` has your live backend API URL and Google OAuth Client ID:
   ```env
   VITE_API_URL=http://vastra-backend-env.eba-ipgmtvpc.us-east-1.elasticbeanstalk.com
   VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   VITE_RAZORPAY_KEY_ID=rzp_test_ZIY1M0ykaWoWyC
   ```
   > **Note on Google OAuth & AWS S3**: In [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials), edit your OAuth 2.0 Web Client and add your S3 website URL (e.g. `http://vastra-shop-frontend-665651551502.s3-website-us-east-1.amazonaws.com`) under **Authorized JavaScript origins**.
3. Run the production build command:
   ```powershell
   npm --prefix frontend run build
   ```
   *This compiles all React components into `frontend/dist`.*

### 2. Package the Backend Source Code
1. Open PowerShell in the root directory.
2. Package the backend into a clean zip archive using `tar` (POSIX format):
   ```powershell
   tar -a -cf backend-deploy.zip --exclude="node_modules" --exclude=".git" -C ./backend .
   ```
   *This generates `backend-deploy.zip` in your project root.*

---

## ⚙️ PART 2: Deploy Backend Manually on AWS Elastic Beanstalk

### Step 1: Create IAM Role for EC2 Instances (One-Time Setup)
1. Log into the [AWS Management Console](https://console.aws.amazon.com/).
2. Search for **IAM** in the top search bar and click **IAM**.
3. In the left menu, click **Roles** -> click **Create role**.
4. Select **AWS service** -> choose **EC2** -> click **Next**.
5. In the permissions search box, search and attach the following policies:
   - `AWSElasticBeanstalkWebTier`
   - `AWSElasticBeanstalkWorkerTier`
   - `AWSElasticBeanstalkMulticontainerDocker`
6. Click **Next**.
7. Role name: `aws-elasticbeanstalk-ec2-role`
8. Click **Create role**.

---

### Step 2: Create Elastic Beanstalk Application & Environment
1. In the AWS Console search bar, search for **Elastic Beanstalk** and open it.
2. Click **Create application** (or **Create environment**).
3. **Configure Environment**:
   - Environment tier: **Web server environment**
   - Application name: `vastra-backend`
   - Environment name: `vastra-backend-env`
4. **Platform Configuration**:
   - Platform: **Node.js**
   - Platform branch: **Node.js 20** or **Node.js 22** running on 64bit Amazon Linux 2023
   - Platform version: Recommended default (e.g. `6.11.8`)
5. **Application Code**:
   - Select **Upload your code**
   - Version label: `v1.0.0`
   - Choose **Local file** -> click **Choose file** -> select your `backend-deploy.zip` file.
6. Click **Next** (or **Configure more options**).

---

### Step 3: Configure EC2 Role & Environment Variables
1. Under **Service access**:
   - EC2 instance profile: Select `aws-elasticbeanstalk-ec2-role`.
2. Under **Environment properties** (Software configuration), click **Add environment property**:
   Add each of the following Key-Value pairs:

   | Property Name | Property Value |
   |---|---|
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=...` |
   | `JWT_SECRET_KEY` | `<your-jwt-secret>` |
   | `ADMIN_EMAIL` | `<your-admin-email>` |
   | `ADMIN_PASSWORD` | `<your-admin-password>` |
   | `CLOUDINARY_NAME` | `<your-cloudinary-name>` |
   | `CLOUDINARY_API_KEY` | `<your-cloudinary-api-key>` |
   | `CLOUDINARY_API_SECRET` | `<your-cloudinary-api-secret>` |
   | `RAZORPAY_KEY_ID` | `<your-razorpay-key-id>` |
   | `RAZORPAY_KEY_SECRET` | `<your-razorpay-key-secret>` |
   | `FRONTEND_URL` | `http://<your-s3-bucket-name>.s3-website-us-east-1.amazonaws.com` |

3. Click **Submit** / **Create Environment**.
4. Wait 3 to 5 minutes while AWS provisions your EC2 instance and deploys Node.js.
5. Once complete, your environment status will show **Health: Green (Ok)**.
6. Copy your Elastic Beanstalk **URL / CNAME** (e.g. `http://vastra-backend-env.eba-xxxx.us-east-1.elasticbeanstalk.com`).
7. **Test API**: Visit `http://vastra-backend-env.eba-xxxx.us-east-1.elasticbeanstalk.com/health` in your browser. You should see `{"status":"ok"}`.

---

## 🌐 PART 3: Deploy Frontend Manually on AWS S3

### Step 1: Create S3 Bucket
1. Open the [AWS S3 Console](https://s3.console.aws.amazon.com/s3/home).
2. Click **Create bucket**.
3. **Bucket Name**: Enter a globally unique name (e.g., `vastra-shop-frontend-665651551502`).
4. **AWS Region**: Select `us-east-1` (US East N. Virginia).
5. **Object Ownership**: Leave default (*ACLs disabled*).
6. **Block Public Access settings**:
   - **Uncheck** "Block *all* public access".
   - Check the acknowledgement box: *"I acknowledge that the current settings may result in this bucket and the objects within becoming public."*
7. Click **Create bucket** at the bottom.

---

### Step 2: Enable Static Website Hosting
1. In the bucket list, click on your newly created bucket name.
2. Go to the **Properties** tab.
3. Scroll down to the very bottom to **Static website hosting**.
4. Click **Edit**.
5. Select **Enable**.
6. Hosting type: **Host a static website**.
7. Index document: `index.html`
8. Error document: `index.html`
9. Click **Save changes**.

---

### Step 3: Configure Public Read Bucket Policy
1. Go to the **Permissions** tab of your bucket.
2. Scroll to **Bucket policy** and click **Edit**.
3. Paste the following JSON policy (replace `YOUR-BUCKET-NAME` with your actual S3 bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

4. Click **Save changes**.

---

### Step 4: Upload Frontend Assets
1. Click on the **Objects** tab of your bucket.
2. Click **Upload**.
3. Click **Add files** and select all files directly inside `frontend/dist/` (`index.html`, `vite.svg`, `preview.jpg`, etc.).
4. Click **Add folder** and select the entire `assets` directory from inside `frontend/dist/assets`.
5. Click **Upload** at the bottom of the page.

---

### Step 5: Access Live Frontend
1. Go to the **Properties** tab of your S3 bucket.
2. Scroll down to **Static website hosting**.
3. Click the **Bucket website endpoint** URL:
   `http://<YOUR-BUCKET-NAME>.s3-website-us-east-1.amazonaws.com`
4. Your application is live!

---

## 🔐 PART 4: MongoDB Atlas Access Setup

1. Log into [MongoDB Atlas](https://cloud.mongodb.com/).
2. Go to **Network Access** in the left sidebar.
3. Click **Add IP Address**.
4. Click **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Confirm**.

---

## 🧪 PART 5: Verification Checklist

- [x] **Backend Health Check**: `http://<your-eb-url>/health` returns `{"status":"ok"}`.
- [x] **Frontend Home Page**: Opens correctly via S3 Website Endpoint.
- [x] **User Authentication**: Sign In and Sign Up work seamlessly.
- [x] **Database Connectivity**: Products and cart items load dynamically from MongoDB Atlas.
