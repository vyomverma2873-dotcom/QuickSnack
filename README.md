# 🍿 QuickSnack - Fast Food Delivery App

A full-stack fast food delivery application with real-time search, order management, dark theme UI, and seamless user experience. Specializing in snacks, cold drinks, paan, and sweets with lightning-fast 10-minute delivery.

![QuickSnack](https://img.shields.io/badge/QuickSnack-Fast%20Food%20Delivery-orange)
![Next.js](https://img.shields.io/badge/Next.js-13-black)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🚀 Features

### 🔍 **Smart Search & Discovery**
- **Auto-suggest search** with real-time product suggestions
- **Keyboard navigation** (arrow keys, enter, escape)
- **Smart matching** across product names, categories, and descriptions
- **Visual highlighting** of search terms
- **Quick add to cart** directly from search suggestions
- **Email OTP Authentication**: Secure signup/login with Resend API
- **Real Address Autocomplete**: Google Places API integration
- **Order Management**: Unique order IDs with email confirmations
- **Responsive Design**: Mobile-first, aesthetic UI
- **Smooth Animations**: Lenis smooth scrolling + Framer Motion

### 🎨 **Modern UI & UX**
- **Dark Theme**: Modern dark UI with glass morphism effects
- **7-Slide Animated Hero**: Auto-playing carousel with manual controls
- **4 Main Categories**: 
  - 🍿 **Snacks and Munchies** (Orange/Red theme)
  - 🥤 **Cold Drinks** (Blue/Cyan theme)
  - 🌿 **Paan Corner** (Green/Emerald theme)
  - 🍭 **Sweet Tooth** (Pink/Purple theme)
- **Glass Morphism Cards**: Modern translucent design elements
- **Smooth Animations**: Framer Motion with hover effects
- **Base64 Image Support**: Seamless image handling and display

### 🛒 **Cart & Order Management**
- **Persistent cart** with local storage
- **Real-time cart updates** across all pages
- **Multiple saved addresses** with default selection
- **Order tracking** with real-time status updates
- **Admin panel** for order and product management

### 📧 **Communication**
- **Email notifications**: Welcome emails, OTP, and order confirmations
- **OTP authentication**: Secure login/signup process

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS + CSS Variables
- **Animations**: Framer Motion + Lenis
- **State Management**: React Hooks + Local Storage
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT + bcrypt
- **Email Service**: Resend API
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Validator.js

### External Services
- **Database**: MongoDB Atlas
- **Email**: Resend API
- **Maps**: Google Places API (with fallback)
- **Backend Deployment**: Render - https://quicksnack-final-backend.onrender.com
- **Frontend Deployment**: Vercel (recommended)

## 📁 Project Structure

```
QuickSnack/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   ├── services/        # Email service
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── components/      # React components
│   ├── pages/          # Next.js pages
│   ├── lib/            # Utilities & API
│   ├── styles/         # Global styles
│   └── package.json
└── README.md
```

## 🎨 Color Palette

The app uses a carefully crafted color palette defined in CSS variables:

```css
--white: #FFFFFF
--mint-green: #B9F8CF      /* Primary accent */
--peach: #FFD6A8           /* Secondary accent */
--sky-blue: #BFDBFF        /* Secondary accent */
--light-grayish-blue: #F1F5F9
--soft-lavender-gray: #EDF2FA
--pale-blue: #D3E4FD
--near-white: #FEFEFE
--off-white: #FDFDFD
--slate-blue-gray: #6B90A7  /* Primary text */
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB Atlas account
- Gmail account with App Password

### 1. Clone & Install

```bash
git clone <repository-url>
cd QuickSnack

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend (.env)**:
```env
PORT=4000
MONGO_URI=mongodb+srv://QuickSnack:QuickSnack%4037@quicksnack.wmea4h4.mongodb.net/?retryWrites=true&w=majority&appName=QuickSnack
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
EMAIL_USER=vyomverma2873@gmail.com
RESEND_API_KEY=your_resend_api_key_here
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)** - Development:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

**Frontend (.env.production)** - Production:
```env
NEXT_PUBLIC_API_BASE_URL=https://quicksnack-final-backend.onrender.com
```

### 3. Run Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  passwordHash: String (optional),
  addresses: [{
    label: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
    isDefault: Boolean
  }],
  isVerified: Boolean,
  role: String (user/admin)
}
```

### Orders Collection
```javascript
{
  orderId: String (QS-YYYYMMDD-abc123),
  userId: ObjectId,
  items: [{
    productId: String,
    name: String,
    qty: Number,
    price: Number
  }],
  amount: Number,
  address: Object,
  status: String (pending/confirmed/dispatched/delivered),
  deliveryInstructions: String
}
```

### OTPs Collection
```javascript
{
  email: String,
  otpHash: String,
  purpose: String (signup/login),
  expiresAt: Date,
  attempts: Number
}
```

## 🔐 Authentication Flow

### Signup Process
1. User enters name, email, phone, password (optional)
2. Backend generates 6-digit OTP and sends via email
3. User verifies OTP to complete registration
4. Welcome email sent automatically
5. JWT token issued for session

### Login Options
- **Password Login**: Email + password
- **OTP Login**: Email + OTP (sent via email)
- Auto-logout on token expiry

## 📧 Email Templates

### Welcome Email
- Subject: "Welcome to QuickSnack — Thanks for joining!"
- Content: Onboarding message with next steps
- Footer: Contact details (Vyom Verma)

### OTP Email
- Subject: "Your QuickSnack OTP"
- Content: 6-digit OTP with 10-minute expiry
- Security note about unauthorized requests

### Order Confirmation
- Subject: "QuickSnack — Order confirmation (QS-XXXXXX-XXXXXX)"
- Content: Order details, items, total amount
- Contact information for support

## 🛒 Cart & Orders

### Cart Management
- Persistent cart using localStorage
- Add/remove/update quantities
- Real-time total calculation
- Cross-session persistence

### Order Flow
1. User adds items to cart
2. Proceeds to checkout (login required)
3. Selects delivery address
4. Places order with unique ID generation
5. Email confirmation sent
6. Order tracking available

### Order ID Format
`QS-YYYYMMDD-XXXXXX` (e.g., QS-20240919-abc123)

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-login-otp` - Login OTP verification

### User Management
- `GET /api/user/me` - Get user profile
- `PUT /api/user/me` - Update profile
- `POST /api/user/addresses` - Add address
- `PUT /api/user/addresses/:id` - Update address
- `DELETE /api/user/addresses/:id` - Delete address

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId/cancel` - Cancel order

### Places (Address Autocomplete)
- `GET /api/places/autocomplete?q=query` - Search places
- `GET /api/places/details/:placeId` - Get place details
- `POST /api/places/reverse-geocode` - Reverse geocode

### Admin
- `GET /api/admin/metrics` - Dashboard metrics
- `GET /api/admin/orders` - All orders (admin)
- `PUT /api/admin/orders/:orderId/status` - Update order status

## 🎨 UI Components

### Hero Section
- 7 auto-playing slides with manual navigation
- Smooth animations with Framer Motion
- Responsive design with mobile gestures
- Progress indicator and slide dots

### Product Categories
- Horizontal scrollable grid
- Hover animations and transitions
- Category icons with gradient backgrounds
- Item count display

### Navigation
- Sticky navbar with location picker
- Global search functionality
- Cart drawer with item management
- User dropdown with profile links

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent spam and abuse
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for frontend domain
- **Helmet Security**: Security headers
- **OTP Expiry**: Time-limited OTP codes

## 🚀 Deployment

### Production URLs
- **Backend**: https://quicksnack-final-backend.onrender.com
- **Frontend**: Deploy to Vercel (recommended)
- **Repository**: https://github.com/vyomverma2873-dotcom/QuickSnack

### Render Backend Deployment

**Backend Service**:
1. Connect GitHub repository: `https://github.com/vyomverma2873-dotcom/QuickSnack`
2. Root directory: `QuickSnack-main/backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables (see below)

### Vercel Frontend Deployment

**Frontend Service**:
1. Connect GitHub repository: `https://github.com/vyomverma2873-dotcom/QuickSnack`
2. Root directory: `QuickSnack-main/frontend`
3. Framework preset: Next.js
4. Build command: `npm run build`
5. Add environment variable: `NEXT_PUBLIC_API_BASE_URL=https://quicksnack-final-backend.onrender.com`

### Environment Variables for Production

**Render Backend**:
```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://QuickSnack:QuickSnack%4037@quicksnack.wmea4h4.mongodb.net/?retryWrites=true&w=majority&appName=QuickSnack
JWT_SECRET=your-secure-random-string-here-local-dev
JWT_EXPIRES_IN=7d
EMAIL_USER=vyomverma2873@gmail.com
RESEND_API_KEY=your_resend_api_key_here
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Vercel Frontend**:
```env
NEXT_PUBLIC_API_BASE_URL=https://quicksnack-final-backend.onrender.com
```

## 👨‍💻 Developer Information

**Founder & Developer**: Vyom Verma  
**Email**: vyomverma2873@gmail.com  
**Phone**: 8766355495  

## 📝 License

This project is proprietary software developed for QuickSnack.

## 🤝 Contributing

This is a private project. For any queries or suggestions, contact Vyom Verma.

---

**QuickSnack** - Delivering happiness, one snack at a time! 🚀
