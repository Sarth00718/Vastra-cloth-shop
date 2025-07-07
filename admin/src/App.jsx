import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { adminDataContext } from './context/AdminContext';
import Home from './pages/Home';
import Add from './pages/Add';
import Lists from './pages/Lists';
import Login from './pages/Login';
import Orders from './pages/Orders';
import './App.css';
import { ToastContainer } from 'react-toastify'

function App() {
  let { admin } = useContext(adminDataContext);

  return (
    <>
    <ToastContainer />
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
