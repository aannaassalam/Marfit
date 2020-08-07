import React from 'react';
import './App.css';
import Navbar from './Layout/Components/Navbar/Navbar';
import Couponbar from './Layout/Components/Couponbar/Couponbar';
import MiniNav from './Layout/Components/MiniNav/MiniNav';
import Home from './Layout/Pages/Home/Home';
import Footer from './Layout/Components/Footer/Footer';
import Cart from './Layout/Pages/Cart/Cart';


function App() {
  return (
    <>
      {/* <Couponbar/>
      <Navbar/>
      <MiniNav/>
      <Home/>
      <Footer/> */}
      <Cart/>
    </>
  );
}

export default App;
