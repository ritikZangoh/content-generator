# Document Based QA Chat Bot

## Problem Statement

Many website owners want chatbots on their sites to assist visitors, but creating and embedding chatbots can be tricky. They need a user-friendly solution that simplifies chatbot creation, makes it easy to add useful information to chatbots, and allows effortless integration into their websites. This solution aims to help website owners engage with visitors more effectively and improve their websites' user experience.

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

3. **Start development server:**

   ```shell
   ./launch-webapp.sh
   ```

4. **Setting environment variables:**
To configure additional environment variables for your application, In backend/.env file and define them as follows:


   * PINECONE_API_KEY=ENTER_PINECONE_KEY


     To get pinecone key visit [https://docs.pinecone.io](https://docs.pinecone.io/docs/quickstart#2-get-and-verify-your-pinecone-api-key)

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


   * PINECONE_API_KEY=ENTER_PINECONE_KEY


     To get pinecone key visit [https://docs.pinecone.io](https://docs.pinecone.io/docs/quickstart#2-get-and-verify-your-pinecone-api-key)

4. **Start backend server:**
   
   ```shell
   cd backend
   gunicorn -k eventlet -w 1 main:app
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

## Contact Support
If you encounter any issues or have questions at any stage of the process, please don't hesitate to reach out to our support team at support@example.com. We're here to assist you.
