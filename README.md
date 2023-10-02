# Document Based Content Generation Bot

Our company specializes in providing a web application that allows users to generate dynamic content that can be embedded on their own websites. This content generation capability is a valuable tool for users who want to engage their website visitors with real-time content, provide personalized responses, or enhance their site's interactivity.

## Our Solution 

![alt Flow Chat](./flow-chart.png)

# Content Generator App Setup Guide

This guide will walk you through the process of setting up a content generator application with a Flask backend and a frontend interface. Follow the steps below to get started.

## Prerequisites

Before you begin, ensure that you have the following software installed on your system:

- Python (3.x recommended)
- Flask (Python web framework)
- Node.js and npm (for frontend setup)
- Mysql server (for database)

## Setup 

1. **Download the code:**
Extract the folder, and open the main root folder.

2. **Excute command for setup environment:**

   ```shell
   ./setup.sh
   ```

3. **Setting environment variables:**
To configure additional environment variables for your application, In backend/.env file and define them as follows:

   * DOC_PATH=ENTER_YOUR_DOCUMENT_PATH
   * VECTOR_DB_PATH=ENTER_YOUR_VECTOR_DATABASE_PATH

   <br>

4. **Configure the frontend to communicate with the backend:**

   Update the API endpoint in your frontend code in .env to match the backend URL (e.g., http://127.0.0.1:4000).

5. **Start development server:**

   ```shell
   ./launch-webapp.sh
   ```

The frontend will be available at [http://localhost:3000](http://localhost:3000) (by default).
<br>

## **For Production:**

1. **Download the code:**
Extract the folder, and open the main root folder.

2. **Excute command for setup environment:**

   ```shell
   ./setup.sh
   ```

3. **Setting environment variables:**
To configure additional environment variables for your application, in backend/.env file and define them as follows:

   * OPENAI_API_KEY=ENTER_YOUR_OPENAI_KEY
   * DOC_PATH=ENTER_YOUR_DOCUMENT_PATH
   * VECTOR_DB_PATH=ENTER_YOUR_VECTOR_DATABASE_PATH

   <br>

4. **Start backend server:**
   
   ```shell
   cd backend
   gunicorn runServer:app
   ```

5. **Configure the frontend to communicate with the backend:**

   Update the API endpoint in your frontend code in .env to match the backend URL (e.g., http://127.0.0.1:8000).

6. **Start frontend server:**
   
   ```shell
   cd frontend
   npm run build
   npm run start
   ```

Be sure to configure environment variables, security settings, and database connections as needed.
The frontend will be available at [http://localhost:3000](http://localhost:3000) (by default).

<br>

# Deploying Flask and Next.js Apps on an EC2 Instance 
This guide provides step-by-step instructions on how to deploy a Flask app and a Next.js app on an EC2 instance using Nginx as a reverse proxy. The Flask app will be accessible via the /api route, while the Next.js app will be served on the base URL.

## Prerequisites
Before you begin, make sure you have the following:

- An AWS EC2 instance with SSH access.
- A domain or subdomain pointing to the IP address of your EC2 instance (you can use Route 53 or any DNS provider).
Python and Node.js installed on your EC2 instance.

<br>

## Setup for Mysql server

1. **Install mysql on ec2:**

Install mysql on local ubuntu machine or ec2.

```shell
sudo apt install mysql-server -y
```

2. **Start mysql server:**

Run command to start mysql server

```shell
sudo systemctl start mysql
```

3. **Create a Database and User:**

Log in to the MySQL server as the root user:

```shell
mysql -u root -p
```

Then, create a database and user and grant privileges:

```shell
CREATE DATABASE demozang;
CREATE USER 'kzangoh' IDENTIFIED BY 'Super1432#*';
GRANT ALL PRIVILEGES ON demozang.* TO 'kzangoh';
FLUSH PRIVILEGES;
EXIT;
```

4. **Create Table for store data:**

Create table chattab in database demozang

```shell
USE demozang;
```

```shell
CREATE TABLE chattab (
    modalid VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    contentType VARCHAR(255),
    samplefile VARCHAR(1024),
    guidelines VARCHAR(255),
    responSeSize VARCHAR(255),
    description VARCHAR(500),
    paid BOOLEAN,
    openkey VARCHAR(255),
    buttonText VARCHAR(100),
    headerText VARCHAR(100),
    descriptionText VARCHAR(100)
);

```


<br>

## Clone Code

Clone code from git repository.

```shell
git clone your_app.git
```

<br>

## Setup the Flask App
1. **Change to Flask App Directory**

    Move to backend directory for setup flask app.

    ```shell
    cd backend
    ```

2. **Install Dependencies**

    Install the required Python packages for your Flask app.

    ```shell
    pip install -r requirements.txt
    ```

## Setup the Next.js App
1. **Change to Next App Directory**

    Move to frontend directory for setup next app.

    ```shell
    cd frontend
    ```

2. **Setup Environment Variable:**

   Add the below config in .env file 

   ```
   NEXT_PUBLIC_API_URL=https://YOUR_EC2_IP_ADDRESS/api
   NEXT_PUBLIC_AUTHKEY=ajsjjsjjsjakflalsaldksdan
   ```

3. **Install Dependencies and Build the App**

    Install the required Node.js packages and build the Next.js app for production.

    ```shell
    npm install
    npm run build
    ```

<br>

## Nginx Config

Certainly! Here are example Nginx configuration files for both the Flask app (served on the /api route) and the Next.js app (served on the base URL) on an EC2 instance:


Create an Nginx server block configuration file for the web app, e.g., <b>/etc/nginx/sites-available/web-app</b>.

```shell
sudo nano /etc/nginx/sites-available/web-app
```

```
server {
    listen 80 default_server;
    server_name YOUR_EC2_IP_ADDRESS;

    # Allows content to be framed by any source
    add_header Content-Security-Policy "frame-ancestors *;";
    
    location /api {
        # Your default configuration goes here
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        # Your default configuration goes here
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Now, create a symbolic link to this configuration file in the <b>/etc/nginx/sites-enabled</b> directory:

```shell
sudo ln -s /etc/nginx/sites-available/web-app /etc/nginx/sites-enabled/
sudo nginx -t
```

<br>


## Restart Nginx
After creating both configuration files, restart Nginx to apply the changes:

```shell
sudo systemctl restart nginx
```

Make sure to replace your_domain_or_ip with your actual domain or IP address.

These configurations will proxy requests to the Flask app to /api and requests to the Next.js app to the base URL, allowing both apps to coexist on the same EC2 instance with Nginx.

<br>

# Setup Supervisor for Process Control System

This guide provides step-by-step instructions for setting up Supervisor to manage Flask and Node.js applications on your server. Supervisor ensures that your applications run reliably, even after system reboots, and makes it easier to manage their lifecycle.

<br>

## Setting up Supervisor for Flask Apps

### 1. Create a Supervisor Configuration File

Create a new Supervisor configuration file for your Flask app in the `/etc/supervisor/conf.d/` directory. For example:

```bash
sudo nano /etc/supervisor/conf.d/my-flask-app.conf
```

### 2. Add following config

In the configuration file, specify the settings for your Flask app:
```
command=/usr/bin/python3 /path/to/your/flask-app/start_server.py
directory=/path/to/your/flask-app/
user=ubuntu
autostart=true
autorestart=true
redirect_stderr=true

```

### 3. List Changes

```shell
sudo supervisorctl reread
sudo supervisorctl update
```

### Start App

```shell
sudo supervisorctl start my-flask-app
sudo supervisorctl status my-flask-app
```

## Setup Supervisor for Next App

### 1. Create a Supervisor Configuration File

Create a new Supervisor configuration file for your Nwxt app in the `/etc/supervisor/conf.d/` directory. For example:

```bash
sudo nano /etc/supervisor/conf.d/my-next-app.conf
```

### 2. Add following config

In the configuration file, specify the settings for your Next app:

```
[program:my-next-app]
command=usr/bin/npm start
directory=/path/to/next-app/
user=ubuntu
autostart=true
autorestart=true
redirect_stderr=true

```

### 3. List config file 

```
sudo supervisorctl reread
sudo supervisorctl update
```

### 4. Start Next App

```
sudo supervisorctl start my-node-app
sudo supervisorctl status my-node-app
```

## Additional Considerations
Set up SSL certificates using Let's Encrypt to enable HTTPS for both apps.

Refer this blog for SSL certificate https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-20-04-1



## Contact Support
If you encounter any issues or have questions at any stage of the process, please don't hesitate to reach out to our support team at support@example.com. We're here to assist you.
