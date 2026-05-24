---
description: Deploy Community Bingo (Node+Express) to AWS EC2
---
# Deploying Community Bingo to AWS EC2

This workflow outlines the steps to deploy your `community-bingo` app (which runs `server.js`) to an AWS EC2 instance.

## Prerequisites
1.  **EC2 Instance**: Launch an **Ubuntu Server 22.04/24.04 LTS** instance (t2.micro or t3.micro is sufficient for free tier).
2.  **Security Group**: Ensure inbound traffic is allowed on:
    *   **SSH (22)** (My IP only recommended)
    *   **HTTP (80)** (Anywhere)
    *   **HTTPS (443)** (Anywhere)
3.  **Key Pair**: Have your `.pem` key file ready for SSH access.

---

## Step 1: Connect to your Instance

Open your terminal (or Putty) and SSH into your instance:
```bash
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-public-ip>
```

---

## Step 2: Install Node.js and NPM

Update the system and install Node.js (v18 or v20).

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource setup)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

---

## Step 3: Transfer Project Files

You have two main options to get your code onto the server:

**Option A: Git (Recommended)**
1.  Push your code to a GitHub repository.
2.  Clone it on the server:
    ```bash
    git clone https://github.com/your-username/community-bingo.git
    cd community-bingo
    ```

**Option B: SCP / File Transfer**
1.  Copy your project folder (excluding `node_modules` and `dist`) from your local machine to the EC2 instance.

---

## Step 4: Install Dependencies & Build

Navigate to your project directory on the server and setup the app.

```bash
cd community-bingo

# Install backend & frontend dependencies
npm install

# Build the frontend (creates the 'dist' folder)
npm run build
```

---

## Step 5: Start with PM2 (Process Manager)

PM2 allows your app to keep running in the background and restart automatically on shallow crashes or system reboots.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start your server
pm2 start server.js --name "bingo-app"

# Save the process list so it respawns on reboot
pm2 save

# Setup startup script (copy/paste the command output by this)
pm2 startup
```

*Your app is now running on port 3000.*

---

## Step 6: Setup Nginx Reverse Proxy (Recommended)

Nginx will listen on port 80 (HTTP) and forward requests to your app on port 3000. This is standard practice.

```bash
# Install Nginx
sudo apt install -y nginx

# Edit default config
sudo nano /etc/nginx/sites-available/default
```

**Replace the file content with the following:**

```nginx
server {
    listen 80;
    server_name _;  # Or your domain name (e.g., example.com)

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save and Exit:** (Ctrl+O, Enter, Ctrl+X)

**Test and Restart Nginx:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 7: Final Check

1.  Open your browser and visit: `http://<your-ec2-public-ip>`
2.  Your Bingo app should load!
3.  Check `/api/totals` to ensure the internal API is reachable.

---

## (Optional) Step 8: Add Domain & HTTPS (SSL)

If you have a domain name:
1.  Point your domain's **A Record** to the EC2 Public IP.
2.  Install Certbot for free SSL:
    ```bash
    sudo apt install -y certbot python3-certbot-nginx
    
    # Generate certificate (follow prompts)
    sudo certbot --nginx -d yourrequestdomain.com
    ```
