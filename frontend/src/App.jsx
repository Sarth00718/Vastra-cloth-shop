import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Login from './pages/Login';
import About from './pages/About';
import Contects from './pages/Contects';
import Collections from './pages/Collections';
import Product from './pages/Product';
import Nav from './components/Nav';
import { useContext, useState, useEffect } from 'react';
import { userDataContext } from './context/UserContext';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import VastraLoadingScreen from './components/VastraLoadingScreen'; 

function App() {
  const { user } = useContext(userDataContext);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500); // Adjust as needed
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Toaster />
      <VastraLoadingScreen isVisible={isLoading} />
      <div
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {user && <Nav />}
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Home />
              ) : (
                <Navigate to="/login" state={{ from: location.pathname }} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to={location.state?.from || '/'} />
              ) : (
                <Registration />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={location.state?.from || '/'} />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/about"
            element={
              user ? (
                <About />
              ) : (
                <Navigate to="/login" state={{ from: location.pathname }} />
              )
            }
          />
          <Route
            path="/contects"
            element={
              user ? (
                <Contects />
              ) : (
                <Navigate to="/login" state={{ from: location.pathname }} />
              )
            }
          />
          <Route
            path="/collections"
            element={
              user ? (
                <Collections />
              ) : (
                <Navigate to="/login" state={{ from: location.pathname }} />
              )
            }
          />
          <Route
            path="/product"
            element={
              user ? (
                <Product />
              ) : (
                <Navigate to="/login" state={{ from: location.pathname }} />
              )
            }
          />
          <Route
            path="/productdetails/:productId"
            element={
              user ? (
                <ProductDetails />
              ) : (
                <Navigate to="/login" state={{ from: location.pathname }} />
              )
            }
          />
          <Route
            path="/cart"
            element={
              user ? (
                <Cart />
              ) : (
                <Navigate to="/login" state={{ from: location.pathname }} />
              )
            }
          />
          <Route
            path="/placeorder"
            element={
              user ? (
                <PlaceOrder />
              ) : (
                <Navigate to="/login" state={{ from: location.pathname }} />
              )
            }
          />
          <Route
            path="/order"
            element={
              user ? (
                <Order />
              ) : (
                <Navigate to="/login" state={{ from: location.pathname }} />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
