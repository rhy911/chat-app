# Frontend-Backend Connection Guide

## ✅ Setup Complete

Your frontend and backend are now connected. Here's what has been configured:

## 📁 Files Created

### API Services (`frontend/src/services/`)

1. **api.js** - Main Axios instance with base configuration
2. **authService.js** - Authentication API calls (signup, signin, signout, refresh)
3. **messageService.js** - Message-related API calls
4. **conversationService.js** - Conversation management
5. **friendService.js** - Friend requests and management

## ⚙️ Configuration

### Backend (.env)

```env
PORT=5001
MONGODB_CONNECTIONSTRING=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=your_secret_key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5001/api
VITE_WS_URL=ws://localhost:3001
```

## 🚀 How to Run Both Servers

### 1. Start Backend Server

```bash
cd backend
npm install  # if not installed yet
npm start    # or npm run dev
```

Backend will run on: `http://localhost:5001`

### 2. Start Frontend Server

```bash
cd frontend
npm install  # if not installed yet
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📝 Important Notes

### API Endpoints Match

The backend uses these endpoints:

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/users/*` - User-related endpoints
- `GET /api/friends/*` - Friend-related endpoints
- `GET /api/messages/*` - Message-related endpoints
- `GET /api/conversations/*` - Conversation-related endpoints

### Authentication Flow

1. User submits login/signup form
2. Frontend sends request to backend API
3. Backend returns access token + sets refresh token cookie
4. Frontend stores access token in memory
5. All subsequent requests include credentials (cookies)
6. If access token expires, use refresh endpoint

### CORS Configuration

✅ Backend is configured to accept requests from `http://localhost:5173`
✅ Credentials (cookies) are enabled on both sides

## 🔧 Current Mismatch to Fix

**IMPORTANT**: Your frontend form uses `phoneNumber`, but the backend expects:

- `username`
- `email`
- `firstName`
- `lastName`
- `password`

### Option 1: Update Frontend Form (Recommended)

Update [Auth.jsx](frontend/src/pages/Auth.jsx) to collect the required fields:

- Change `phoneNumber` input to `email`
- Add `firstName` and `lastName` inputs
- Keep `username` and `password`

### Option 2: Update Backend API

Modify [authController.js](backend/src/controllers/authController.js) to accept `phoneNumber` instead of the current fields.

## 🧪 Testing the Connection

1. **Start both servers**
2. **Open browser**: `http://localhost:5173`
3. **Open browser console** (F12)
4. **Try to sign up/login** - you should see network requests in the Network tab
5. **Check for errors** in the console

### Expected Flow

- ✅ Frontend sends request to `http://localhost:5001/api/auth/signin`
- ✅ Backend processes and returns token
- ✅ Frontend stores token and navigates to chat
- ✅ Subsequent API calls include the authentication cookie

## 🐛 Common Issues

### 1. CORS Errors

- Make sure `CLIENT_URL=http://localhost:5173` in backend `.env`
- Backend should show CORS middleware loaded

### 2. Connection Refused

- Ensure backend is running on port 5001
- Check `VITE_API_URL` in frontend `.env`

### 3. 401 Unauthorized

- Token might be expired or invalid
- Try logging in again
- Check if refresh token cookie is being sent

### 4. Field Validation Errors

- Ensure frontend sends all required fields
- Match backend field names exactly

## 📦 Dependencies Installed

- ✅ `axios` - HTTP client for API calls

## 🔐 Security Notes

- Access tokens expire in 30 minutes
- Refresh tokens expire in 14 days
- Tokens are stored in HTTP-only cookies (secure)
- Always use HTTPS in production

## 🎯 Next Steps

1. **Update Auth Form** to match backend requirements
2. **Test authentication flow** end-to-end
3. **Implement Chat.jsx** to fetch real conversations
4. **Add error handling** for better UX
5. **Consider adding loading states** during API calls

## 📚 API Service Usage Examples

### Login Example

```javascript
import { authService } from '../services/authService';

try {
  const response = await authService.login({
    username: 'testuser',
    password: 'password123'
  });
  console.log('Logged in:', response);
} catch (error) {
  console.error('Login failed:', error.response?.data);
}
```

### Send Message Example

```javascript
import { messageService } from '../services/messageService';

try {
  const message = await messageService.sendMessage(
    'receiver_user_id',
    'Hello!'
  );
  console.log('Message sent:', message);
} catch (error) {
  console.error('Failed to send message:', error);
}
```

### Get Conversations Example

```javascript
import { conversationService } from '../services/conversationService';

try {
  const conversations = await conversationService.getConversations();
  console.log('Conversations:', conversations);
} catch (error) {
  console.error('Failed to fetch conversations:', error);
}
```

---

**Need help?** Check the browser console and network tab for detailed error messages.
