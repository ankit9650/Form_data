import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FormComponent from "../Components/FormComponent";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Login from '../Pages/Login';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import Data from '../Components/Data'

function MyRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<FormComponent />} />

        
      
        <Route element={<ProtectedRoute />}>
         
          <Route path='/data' element={<Data/>}/>
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default MyRoutes;
