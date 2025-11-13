# ByteEat - Restaurant Management System

A modern, full-stack restaurant management system featuring digital menus, QR code ordering, real-time order tracking, and comprehensive analytics.

<img width="2859" height="1514" alt="image" src="https://github.com/user-attachments/assets/90a9200a-643b-4ca0-8b0a-7c9f35e77bad" />

## 🚀 Features

### Customer-Facing Features
- **QR Code Digital Menus** - Contactless menu access via customized QR codes
- **Real-time Ordering** - Place orders directly from tables without waiter intervention
- **Menu Categories & Search** - Easy navigation with categorized items and search functionality
- **Order Tracking** - Real-time order status updates (Pending → Preparing → Ready)
- **Responsive Design** - Optimized for mobile, tablet, and desktop devices

### Restaurant Management
- **Menu Management** - Create, update, and organize menu items with images
- **Order Management** - Track and manage customer orders in real-time
- **Table Management** - Generate unique QR codes for each table
- **Analytics Dashboard** - Insights into orders, revenue, and popular items
- **Staff Management** - Role-based access control (Admin/Waiter)
- **Receipt Generation** - Automatic receipt generation for completed orders

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework for production
- **TypeScript** - Type-safe code
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Lucide Icons** - Beautiful icon set

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication solution
- **Prisma ORM** - Type-safe database client
- **MongoDB** - NoSQL database

### Additional Tools
- **Cloudinary** - Image upload and storage
- **QR Code Generator** - Dynamic QR code generation
- **React Hook Form** - Form validation
- **Zod** - Schema validation

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/g1mishra/byte-eat-ui.git
cd byte-eat-ui
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Environment Configuration**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/byte_eat_db"

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Database Setup**
```bash
pnpm migrate
# or
npm run migrate
```

5. **Run the development server**
```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

```
byte_eat_ui/
├── app/                      # Next.js app directory
│   ├── [slug]/              # Dynamic customer-facing routes
│   │   └── view-cart/       # Order placement logic
│   ├── manage/              # Restaurant management dashboard
│   │   └── restaurant/      
│   │       └── [restroId]/  
│   │           ├── manual-order/  # Manual order creation
│   │           ├── menu/          # Menu management
│   │           └── orders/        # Order management
│   ├── api/                 # API routes
│   └── onboarding/          # User onboarding
├── components/              # React components
│   ├── home/               # Landing page components
│   └── ui/                 # Reusable UI components
├── services/               # API service functions
│   ├── order.services.ts   # Order-related operations
│   ├── menu.services.ts    # Menu management
│   └── helper.service.ts   # Helper functions
├── lib/                    # Utility functions
├── prisma/                 # Database schema
│   └── schema.prisma       # Prisma schema definition
├── public/                 # Static assets
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
```

## 🔑 Key Files

### Order Placement Logic
- **[app/[slug]/view-cart/page.tsx](app/[slug]/view-cart/page.tsx)** - Customer order placement
- **[app/manage/restaurant/[restroId]/manual-order/QuickOrder.tsx](app/manage/restaurant/[restroId]/manual-order/QuickOrder.tsx)** - Manual order creation
- **[services/order.services.ts](services/order.services.ts)** - Core order service functions

### Menu Management
- **[services/helper.service.ts](services/helper.service.ts)** - Menu item CRUD operations
- **[services/menu.services.ts](services/menu.services.ts)** - Menu service functions

## 🚦 Available Scripts

```bash
# Development
pnpm dev          # Start development server

# Build
pnpm build        # Build for production

# Production
pnpm start        # Start production server

# Database
pnpm migrate      # Push database schema changes

# Code Quality
pnpm lint         # Run ESLint
pnpm prettier     # Format code with Prettier
```

## 🗄️ Database Schema

The application uses **15+ database models** including:
- User, Restaurant, MenuItem, Category
- Order, OrderItem, PriceItemMap
- Table, Waiter, Analytics
- And more...

See [prisma/schema.prisma](prisma/schema.prisma) for the complete schema.

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/g1mishra/byte-eat-ui)

### Other Platforms
The application can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS
- DigitalOcean

## 📱 Live Demo

Check out the live demo: [https://byteeat.vercel.app](https://byteeat.vercel.app)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Jeevan Mishra**
- GitHub: [@g1mishra](https://github.com/g1mishra)
- LinkedIn: [Jeevan Mishra](https://www.linkedin.com/in/g1mishra)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com)

---

⭐ Star this repository if you find it helpful!
