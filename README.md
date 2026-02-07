# Production Inventory System - Frontend

A modern, responsive web application built with **React** and **Redux** for managing production inventory with real-time production planning capabilities.

##  Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Building for Production](#building-for-production)
- [Testing](#testing)

---

##  Technologies

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **CSS3** - Styling
- **React Icons** - Icon library

---

##  Features

### Core Functionality
-  **Product Management** - Create, read, update, delete products
-  **Raw Materials Management** - Full CRUD + stock adjustments (increase/decrease)
-  **Product Details** - View and manage Bill of Materials (BOM)
-  **Production Planning** - Intelligent production calculation with visual dashboard
-  **Real-time Updates** - Instant state synchronization with backend
-  **Responsive Design** - Works on desktop, tablet, and mobile devices
-  **Low Stock Alerts** - Visual indicators for materials below threshold

### User Experience
- Intuitive navigation with sidebar menu
- Confirmation dialogs for destructive actions
- Loading states and error handling
- Form validation
- Toast notifications
- Modals for quick actions

---

##  Prerequisites

- **Node.js 18+ or 20+** (LTS recommended)
- **npm 9+** or **yarn 1.22+**
- Backend API running at http://localhost:8080

---

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/inventory-frontend.git
cd inventory-frontend
```

### 2. Install dependencies

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

---

##  Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080
```

### API Client Configuration

The API client is configured in `src/services/api/client.js`:

```javascript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

---

##  Running the Application

### Development Mode (with hot reload)

```bash
npm run dev
```

The application will start at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

##  Project Structure

```
inventory-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.css
│   │   │   ├── Card/
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Card.css
│   │   │   ├── Table/
│   │   │   │   ├── Table.jsx
│   │   │   │   └── Table.css
│   │   │   └── Loading/
│   │   │       ├── Loading.jsx
│   │   │       └── Loading.css
│   │   ├── Layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Layout.css
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.css
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── RawMaterials.jsx
│   │   └── ProductionPlan.jsx
│   ├── services/
│   │   └── api/
│   │       ├── client.js
│   │       ├── productsAPI.js
│   │       ├── rawMaterialsAPI.js
│   │       └── productionPlanAPI.js
│   ├── store/
│   │   ├── index.js
│   │   └── slices/
│   │       ├── productsSlice.js
│   │       ├── rawMaterialsSlice.js
│   │       └── productionPlanSlice.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

##  Available Pages

### 1. Dashboard (`/`)
- Overview of the system
- Quick stats and metrics
- Navigation shortcuts

### 2. Products (`/products`)
- List all products with pricing and stock
- Create new products
- Edit existing products
- Delete products
- View product details (navigate to ProductDetails)

### 3. Product Details (`/products/:id`)
- Product information summary
- **Bill of Materials (BOM)** management:
  - Add raw materials to product
  - Set quantity required per unit
  - Edit required quantities
  - Remove raw materials
  - Visual stock availability indicators

### 4. Raw Materials (`/raw-materials`)
- List all raw materials with stock levels
- Create new raw materials
- Edit raw material information
- Delete raw materials
- **Stock Management**:
  - Increase stock
  - Decrease stock
  - Set absolute stock value
- Low stock warnings (< 10 units)

### 5. Production Plan (`/production-plan`)
- **Summary Dashboard**:
  - Total products that can be produced
  - Total production value
  - Total units
  - Low stock alerts count
- **Production Schedule Table**:
  - Products prioritized by value
  - Quantities that can be produced
  - Unit prices and total values
- **Low Stock Warnings**:
  - Materials below threshold
  - Current stock levels
- **Production Notes**:
  - Algorithm explanation
  - Calculation methodology

---

##  State Management

The application uses **Redux Toolkit** for centralized state management.

### Store Structure

```javascript
{
  products: {
    items: [],           // All products
    selectedProduct: {}, // Currently viewed product
    loading: false,
    error: null
  },
  rawMaterials: {
    items: [],           // All raw materials
    lowStockItems: [],   // Materials below threshold
    loading: false,
    error: null
  },
  productionPlan: {
    plan: {},            // Current production plan
    loading: false,
    error: null
  }
}
```

### Redux Slices

#### Products Slice
```javascript
// Actions
fetchProducts()
fetchProductById(id)
createProduct(product)
updateProduct({ id, product })
deleteProduct(id)
addRawMaterialToProduct({ productId, rawMaterial })
removeRawMaterialFromProduct({ productId, rawMaterialId })
updateRawMaterialQuantity({ productId, rawMaterialId, quantity })
```

#### Raw Materials Slice
```javascript
// Actions
fetchRawMaterials()
createRawMaterial(rawMaterial)
updateRawMaterial({ id, rawMaterial })
deleteRawMaterial(id)
updateStock({ id, quantity })
increaseStock({ id, quantity })
decreaseStock({ id, quantity })
fetchLowStock(threshold)
```

#### Production Plan Slice
```javascript
// Actions
fetchProductionPlan()
fetchProductionForProduct(productId)
checkCanProduce({ productId, quantity })
```

---

##  API Integration

All API calls are centralized in service files:

### Products API (`productsAPI.js`)
```javascript
getAllProducts()
getProductById(id)
createProduct(product)
updateProduct(id, product)
deleteProduct(id)
addRawMaterialToProduct(productId, rawMaterial)
removeRawMaterialFromProduct(productId, rawMaterialId)
updateRawMaterialQuantity(productId, rawMaterialId, quantity)
```

### Raw Materials API (`rawMaterialsAPI.js`)
```javascript
getAllRawMaterials()
getRawMaterialById(id)
createRawMaterial(rawMaterial)
updateRawMaterial(id, rawMaterial)
deleteRawMaterial(id)
updateStock(id, quantity)
increaseStock(id, quantity)
decreaseStock(id, quantity)
getLowStock(threshold)
```

### Production Plan API (`productionPlanAPI.js`)
```javascript
getProductionPlan()
getProductionForProduct(productId)
canProduceQuantity(productId, quantity)
```

---

##  Styling

The application uses **CSS3** with modular component-based styling:

- Global styles in `index.css`
- Component-specific styles in respective `.css` files
- Responsive design with media queries
- CSS variables for consistent theming

### Color Palette
- Primary: `#3498db` (Blue)
- Success: `#27ae60` (Green)
- Warning: `#f39c12` (Orange)
- Danger: `#e74c3c` (Red)
- Secondary: `#95a5a6` (Gray)

---

##  Building for Production

### Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Environment Variables for Production

Create `.env.production`:

```env
VITE_API_URL=https://your-production-api.com
```

### Deploy

The `dist/` folder can be deployed to:
- **Vercel** - `vercel --prod`
- **Netlify** - Drag & drop `dist/` folder
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Docker** + Nginx

#### Example Dockerfile

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

##  Key Features Explained

### Product Details - BOM Management

The Bill of Materials interface allows:
1. Adding raw materials to a product
2. Specifying quantity required per product unit
3. Visual indicators showing if stock is sufficient
4. Easy editing and removal of materials

### Production Plan Algorithm

The system:
1. Fetches all products and their BOMs
2. Calculates max producible quantity per product
3. Prioritizes products by highest value
4. Allocates materials starting with highest-value products
5. Shows comprehensive production plan with total value

### Stock Management

Three methods for updating raw material stock:
- **Set Stock**: Set absolute quantity
- **Increase Stock**: Add to current stock (e.g., new shipment)
- **Decrease Stock**: Remove from stock (e.g., waste, production)


---

##  License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Carlos Barbosa** - Initial work




