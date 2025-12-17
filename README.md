![Logo](./public//FFFFFF-1.png)

# Slooze - Commodities Management System (FRONTEND CHALLENGE! )

A modern, full-featured **Commodities Management System** built with Vite(React), TypeScript, and Tailwind CSS. The system integrates with the DummyJSON API to fetch real product data while maintaining hybrid functionality where users can create custom products that persist in localStorage alongside API data.

## 🚀 Features

### Authentication & Authorization

- **Role-Based Access Control** with three user roles:
  - **Admin**: Full access to all pages including Admin Panel
  - **Manager**: Access to Inventory and Dashboard
  - **Store Keeper**: Access to Inventory only
- **Protected Routes** with role-based navigation
- **Session Management** with localStorage persistence

### Product Management (CRUD)

- ✅ **Create**: Add custom products with validation
- ✅ **Read**: Display products from API + localStorage
- ✅ **Update**: Edit custom products (API products are read-only)
- ✅ **Delete**: Remove custom products with confirmation dialog

### Advanced Features

- **Hybrid Data Model**: Seamless integration of DummyJSON API products and custom products
- **Advanced Filtering**: Search, category filter, price range, stock status
- **Dynamic Sorting**: Sort by title, price, stock, category, date
- **Real-Time Statistics**: Total products, inventory value, low stock alerts
- **Dashboard Analytics**: Charts, graphs, and product insights
- **Responsive Design**: Mobile, tablet, and desktop support
- **Modern UI**: Built with shadcn/ui components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

## 🛠️ Getting Started

### Installation

1. **Clone the repository** (if applicable):

   ```bash
   git clone <repository-url>
   cd slooze-cms
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

## 🌐 Live Demo

The project is live and deployed on **Vercel**.

https://slooze-commodities-management-eta.vercel.app/

## 🔐 Default Login Credentials

The system comes with a default admin account:

- **Email**: `admin@slooze.com`
- **Password**: `admin123`

You can also register new users with different roles (Manager, and Store Keeper).

## 📁 Project Structure

```
src/
├── assets/
│   └── FFFFFF-1.png                 # Slooze Logo
├── components/
│   ├── dashboard/                   # Dashboard components
│   │   ├── CategoryChart.tsx        # Category distribution chart
│   │   ├── LowStockAlerts.tsx       # Low stock warnings
│   │   ├── PriceTrends.tsx          # Price trend analysis
│   │   ├── RecentProducts.tsx       # Recently added products
│   │   ├── StockOverview.tsx        # Stock status overview
│   │   └── TopProducts.tsx          # Top products by value
│   ├── inventory/                   # Inventory-specific components
│   │   ├── DeleteDialog.tsx         # Delete confirmation modal
│   │   ├── EmptyStat.tsx            # Empty Stat Component
│   │   ├── FormField.tsx            # Form Field Component
│   │   ├── ProductCard.tsx          # Product display card
│   │   ├── ProductForm.tsx          # Add/Edit product form
│   │   └── ProductGrid.tsx          # Product grid display
│   ├── layout/                      # Layout components
│   │   ├── Footer.tsx               # Footer Component
│   │   ├── Layout.tsx               # Main layout wrapper
│   │   ├── LoadingStat.tsx          # Loading Stat Component
│   │   ├── Navbar.tsx               # Navigation bar
│   │   ├── NavbarActions.tsx        # Route-specific actions
│   │   ├── ProductFilters.tsx       # Filtering controls
│   │   └── StatsCards.tsx           # Statistics cards
│   ├── ui/                          # Reusable UI components (shadcn/ui)
│   └── ProtectedRoute.tsx           # Route protection with role checks
├── contexts/
│   ├── AuthContext.ts               # Authentication state and logic
│   ├── AuthProvider.tsx             # Auth context provider wrapper
│   ├── themeContext.ts              # Theme state and logic
│   └── themeProvider.tsx            # Theme (light/dark) context provider
├── hooks/
│   ├── useAuth.ts                   # Authentication hook
│   ├── useCategories.ts             # Category management
│   ├── useFilters.ts                # Filtering logic
│   ├── useLocalProducts.ts          # Local product operations
│   ├── useProducts.ts               # Product management hook
│   ├── useSorting.ts                # Sorting logic
│   └── useTheme.ts                  # Theme state management hook
├── lib/
│   └── utils.ts                     # Utility helpers (class merging, helpers)
├── pages/
│   ├── AdminPanel.tsx               # Admin-only user management (coming soon)
│   ├── AuthPage.tsx                 # Login/Register page
│   ├── Dashboard.tsx                # Analytics and insights
│   └── Inventory.tsx                # Product inventory management
├── types/
│   ├── product.ts                   # Product type definitions
│   └── user.ts                      # User type definitions
├── utils/
│   ├── apiService.ts                # DummyJSON API integration
│   ├── auth.ts                      # Auth utilities (localStorage)
│   ├── localStorage.ts              # Custom product persistence
│   └── productMetrics.ts            # Product statistics calculations
├── App.tsx                          # Main app entry point with routing
├── index.css                        # Global styles and Tailwind config
└── main.tsx                         # Main app entry point with routing
```

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎨 Tech Stack

- **Framework**: VIte(React)+ TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind)
- **Forms**: react-hook-form
- **Routing**: React Router
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Fetch API with DummyJSON
- **Storage**: localStorage (session & products)

## 🌐 API Integration

The system uses the [DummyJSON API](https://dummyjson.com/) for product data:

- **Endpoint**: `https://dummyjson.com/products?limit=100`
- **Caching**: 1-hour cache to reduce API calls
- **Hybrid Model**: API products + custom localStorage products

## 🔐 Authentication Flow

1. **Login Page** with form validation
2. **Session Storage** in localStorage

## 📝 User Roles & Permissions

| Feature               | Store Keeper | Manager | Admin |
| --------------------- | ------------ | ------- | ----- |
| Inventory (View/Edit) | ✅           | ✅      | ✅    |
| Dashboard             | ❌           | ✅      | ✅    |
| Admin Panel           | ❌           | ❌      | ✅    |

## 🚧 Roadmap

- [ ] Complete Admin Panel with user management
- [ ] Migrate to real backend API
- [ ] Add password hashing (bcrypt)
- [ ] Implement JWT token authentication
- [ ] Add export/import functionality (CSV, Excel)
- [ ] Advanced analytics and reporting
- [ ] Product image upload
- [ ] Multi-currency support

## 📄 License

This project is licensed under the MIT License and is intended for demonstration and evaluation purposes.

## 🤝 Contributing

This is a production-ready demo application. Feel free to fork and extend it for your own use cases.

---

## 📞 Support

For issues or questions, please refer to the inline code documentation.
