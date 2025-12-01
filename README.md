# 🍽️ Khatafy - Mess Management System

A comprehensive digital solution for managing mess operations, budgets, and member activities. Khatafy streamlines the entire process of running a communal mess, from user management to bazar (market) tracking and budget monitoring.

## 🌟 Features

### 👥 User Management
- **Multi-role System**: Admin, Manager, and Member roles with specific permissions
- **Secure Authentication**: JWT-based authentication with access and refresh tokens
- **User Controls**: Kick/unkick users, promote members to managers
- **Profile Management**: Update user information and preferences

### 🏠 Mess Management
- **Create & Manage Multiple Messes**: Support for multiple mess units
- **Member Invitation System**: Invite users to join specific messes via email
- **Manager Role Transfer**: Seamless transfer of manager responsibilities
- **Budget Tracking**: Set and monitor monthly budgets
- **Member Management**: Add/remove members from mess units

### 🛒 Bazar (Market Shopping) Tracking
- **Shopping List Creation**: Create detailed shopping lists with items, quantities, and prices
- **Item Management**: Add, update, and delete items from bazar lists
- **Approval System**: Manager verification for bazar expenses
- **Expense Analytics**: Track total spending per mess
- **Member-specific Tracking**: View all bazars created by individual members

### 📊 Dashboard & Analytics
- **Admin Dashboard**: 
  - Total users, messes, and bazars count
  - User distribution by role
- **Manager Dashboard**:
  - Budget vs. spending comparison
  - Mess-wise expense breakdown
  - Pending bazar approvals
- **Member Dashboard**:
  - Personal bazar history
  - Mess participation details

### 📧 Email Notifications
- Welcome emails for new mess members
- Manager promotion notifications
- Automated email templates

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Email Service**: Custom email utility with templates
- **Deployment**: Vercel (Serverless)

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Server Actions**: For server-side operations
- **Cookie Management**: next/headers for token storage
- **Form Handling**: React Hook Form
- **Cache Management**: Next.js revalidateTag

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/khatafy-server.git
cd khatafy-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

4. Run the development server:
```bash
npm run dev
```

### Frontend Setup

1. Clone the frontend repository:
```bash
git clone https://github.com/yourusername/khatafy-client.git
cd khatafy-client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_BACKEND=http://localhost:5000/api/v1
```

4. Run the development server:
```bash
npm run dev
```

## 🚀 Deployment

### Backend (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard

4. Ensure MongoDB allows connections from `0.0.0.0/0` (if using MongoDB Atlas)

### Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables
4. Deploy

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/users` - Get all users (Admin)
- `GET /api/v1/auth/user` - Get current user
- `POST /api/v1/auth/kick/:userId` - Kick user (Admin)
- `POST /api/v1/auth/un-kick/:userId` - Unkick user (Admin)
- `POST /api/v1/auth/assign-manager/:userId` - Promote to manager (Admin)
- `PUT /api/v1/auth/user/update` - Update user profile
- `GET /api/v1/auth/admin-state` - Admin statistics
- `GET /api/v1/auth/admin-user` - User role distribution

### Mess Management
- `POST /api/v1/mess/create` - Create new mess
- `GET /api/v1/mess` - Get all messes
- `GET /api/v1/mess/:id` - Get single mess
- `PATCH /api/v1/mess/update/:id` - Update mess
- `DELETE /api/v1/mess/delete/:id` - Delete mess
- `POST /api/v1/mess/invite/:messId` - Invite user to mess
- `POST /api/v1/mess/shift-manager/:messId` - Transfer manager role
- `POST /api/v1/mess/remove-member-mess` - Remove member from mess
- `GET /api/v1/mess/manager/state` - Manager budget statistics
- `GET /api/v1/mess/get-member` - Get member's messes

### Bazar Management
- `POST /api/v1/bazar/create/:messId` - Create bazar list
- `GET /api/v1/bazar/bazar-all/:messId` - Get all bazars for mess
- `GET /api/v1/bazar/bazar/:bazarId` - Get single bazar
- `GET /api/v1/bazar/bazar-all` - Get all bazars (Admin)
- `POST /api/v1/bazar/add-item/:bazarId` - Add item to bazar
- `PUT /api/v1/bazar/update-item/:bazarId` - Update bazar
- `DELETE /api/v1/bazar/delete-item/:bazarId` - Delete bazar
- `POST /api/v1/bazar/change-status/:bazarId` - Approve bazar (Manager)
- `GET /api/v1/bazar/get-bazar-manager` - Get bazars for manager's messes
- `GET /api/v1/bazar/member` - Get member's bazars

## 🔐 Role-Based Access Control

### Admin
- Manage all users (kick/unkick, promote)
- View system-wide statistics
- Access all messes and bazars

### Manager
- Manage assigned mess
- Approve bazar expenses
- Invite members to mess
- Transfer manager role
- View budget statistics

### Member
- Join messes via invitation
- Create and manage personal bazars
- View mess information
- Update personal profile



## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape Khatafy
- Built with love for mess management efficiency

## 📞 Support

For support, email support@khatafy.com or open an issue in the repository.

---

<div align="center">
Made with ❤️ by the Khatafy Team
</div>
