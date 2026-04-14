# Quick Start Guide

## One-Command Setup (Windows)

### Step 1: Install Backend Dependencies
```powershell
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
```

### Step 2: Install Frontend Dependencies
```powershell
cd ../frontend
npm install
```

### Step 3: Start Services

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## Test the Application

1. Go to http://localhost:5173
2. Click "Register" and create a new account
3. You'll be redirected to the Dashboard
4. Click "Logout" to return to Login

## Key Features Working

✅ User Registration (validates email, password match, minimum length)
✅ User Login (JWT token generation)
✅ Dashboard (protected route - requires login)
✅ Auto-login (token persists in localStorage)
✅ Logout (clears token)
✅ Error Messages (validation + server errors)

## API Testing with cURL (Optional)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","confirmPassword":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get User (with token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Important Notes

- MongoDB must be running locally or use MongoDB Atlas connection string
- Frontend communicates with backend on `http://localhost:5000/api`
- Tokens are stored in browser localStorage
- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens expire after 7 days

## Before Production

1. Change JWT_SECRET to a strong random string
2. Set NODE_ENV to "production"
3. Configure CORS properly for your domain
4. Use HTTPS in production
5. Set up database backups
6. Add rate limiting to API endpoints
