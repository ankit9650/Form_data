import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormComponent from "../Components/FormComponent";

import Data from "../Components/Data";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Login from '../Pages/Login';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Home from '../Components/Home';
function MyRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
      
        <Route path="" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/form" element={<FormComponent />} />
          <Route path="/data" element={<Data />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default MyRoutes