import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext, lazy, Suspense } from 'react';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { userDataContext } from './context/UserContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import SkeletonPage from './components/SkeletonPage';

// ─── LAZY ROUTES ─────────────────────────────────────────────────────────────
const Home = lazy(() => import('./pages/Home'));
const Registration = lazy(() => import('./pages/Registration'));
const Login = lazy(() => import('./pages/Login'));
const About = lazy(() => import('./pages/About'));
const Contects = lazy(() => import('./pages/Contects'));
const Collections = lazy(() => import('./pages/Collections'));
const Product = lazy(() => import('./pages/Product'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'));
const Order = lazy(() => import('./pages/Order'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

const NotFound = lazy(() => import('./pages/NotFound'));

// ─── ADMIN LAZY ROUTES ────────────────────────────────────────────────────────
const AdminHome = lazy(() => import('./pages/admin/Home'));
const AdminAdd = lazy(() => import('./pages/admin/Add'));
const AdminLists = lazy(() => import('./pages/admin/Lists'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));

// ─── PROTECTED ROUTE ─────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(userDataContext);
  const location = useLocation();
  
  if (loading) return <SkeletonPage />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

// ─── ADMIN PROTECTED ROUTE ───────────────────────────────────────────────────
function AdminProtectedRoute({ children }) {
  const { user, loading } = useContext(userDataContext);
  const location = useLocation();
  
  if (loading) return <SkeletonPage />;
  if (!user || user.role !== 'admin') return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

// ─── GUEST ROUTE (redirect authenticated users away from login/signup) ────────
function GuestRoute({ children }) {
  const { user, loading } = useContext(userDataContext);
  const location = useLocation();
  
  if (loading) return <SkeletonPage />;
  if (user) {
    const from = location.state?.from;
    const target = user.role === 'admin'
      ? (from || '/admin')
      : (from && !from.startsWith('/admin') ? from : '/');
    return <Navigate to={target} replace />;
  }
  return children;
}

// ─── PAGES WITHOUT FOOTER / NAVBAR ───────────────────────────────────────────
const NO_FOOTER_PATHS = ['/login', '/signup'];
const NO_NAV_PATHS = ['/login', '/signup'];

function App() {
  const { user, loading } = useContext(userDataContext);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const showNav = !isAdminPath && !NO_NAV_PATHS.includes(location.pathname);
  const showFooter = !NO_FOOTER_PATHS.includes(location.pathname) && !isAdminPath;

  if (loading) return <SkeletonPage />;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
      {showNav && <Nav />}
      <Suspense fallback={<SkeletonPage />}>
        <Routes>
          {/* Guest routes (redirect logged-in users away) */}
          <Route path="/signup" element={<GuestRoute><Registration /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />

          {/* Public storefront routes (accessible without authentication) */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contects" element={<Contects />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product" element={<Product />} />
          <Route path="/productdetails/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* User Protected routes (checkout, order history, wishlist) */}
          <Route path="/placeorder" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
          <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

          {/* Admin Protected routes */}
          <Route path="/admin" element={<AdminProtectedRoute><AdminHome /></AdminProtectedRoute>} />
          <Route path="/admin/add" element={<AdminProtectedRoute><AdminAdd /></AdminProtectedRoute>} />
          <Route path="/admin/lists" element={<AdminProtectedRoute><AdminLists /></AdminProtectedRoute>} />
          <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {showFooter && <Footer />}
    </>
  );
}

export default App;
