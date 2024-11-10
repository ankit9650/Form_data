import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FormComponent from "../Components/FormComponent";
import Navbar from "../Components/Navbar";
// import Footer from "../Components/Footer";
import Login from '../Pages/Login';
import ProtectedRoute from '../Router/ProtectedRoute';
import NotFound from '../Components/NotFound'
import Data from '../Components/Data'
import ListProd from '../Pages/ListProd';
import Product from '../Pages/Product';
import Home from '../Pages/Home';
import Cart from '../Pages/Cart';

function MyRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<FormComponent />} />      
      
        <Route element={<ProtectedRoute />}>         
          <Route path='/data' element={<Data/>}/>
          <Route path='/product' element={<ListProd/>}/>
          <Route path='/product/add' element={<Product/>}/>
          <Route path='/home' element={<Home/>}/> 
          <Route path='/cart' element={<Cart/>}/> 
          

        </Route>
        <Route path="*" element={<NotFound/>} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default MyRoutes;
