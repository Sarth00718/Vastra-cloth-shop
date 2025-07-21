import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { adminDataContext } from './context/AdminContext';
import Home from './pages/Home';
import Add from './pages/Add';
import Lists from './pages/Lists';
import Login from './pages/Login';
import Orders from './pages/Orders';
import './App.css';
import { Toaster } from 'react-hot-toast';

function App() {
  let { admin } = useContext(adminDataContext);

  return (
    <>
    <Toaster 
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          style: {
            background: 'green',
          },
        },
        error: {
          style: {
            background: 'red',
          },
        },
      }}
    />
      {!admin ? (
        <Login />
      ) : (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add' element={<Add />} />
          <Route path='/lists' element={<Lists />} />
          <Route path='/login' element={<Login />} />
          <Route path='/orders' element={<Orders />} />
        </Routes>
      )}
    </>
  );
}

export default App;
