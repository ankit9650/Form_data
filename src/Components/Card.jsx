import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Features/Cart/cart';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Card({ imgSrc, title, color, userName, unit, productid, price }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleCart = async () => {
    const token = localStorage.getItem("jwtToken"); 
    if (!token) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login"); 
      return;
    }

    const productData = {
      productid,
      title,
      imgSrc,
      color,
      userName,
      unit,
      price,
      quantity, 
    };

    dispatch(addToCart({
      ...productData,
      quantity,  
    }));

    try {
      await axios.post('http://localhost:5000/cart', productData, {
        headers: {
          'Authorization': `Bearer ${token}`,  
        },
      });

      toast.success(`${title} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart. Please try again.');
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="max-w-sm bg-white rounded-lg overflow-hidden font-Poppins shadow-md shadow-black p-1">
      <img className="w-full h-72 rounded shadow" src={`http://localhost:5000${imgSrc}`} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-1">{title}</div>
        <div className="font-semibold text-md mb-2">Added By: {userName}</div>
        <div className="flex flex-row space-x-5">
          <p className="text-gray-700 text-base">{color}</p>
          <p className="text-gray-700 text-base">Unit: {unit}</p>      
          <p className="text-gray-700 text-base">₹ {price}</p>        
        </div>
        
        <div className="flex items-center mt-2">
          <label htmlFor="" className="text-gray-700 text-base text-md mr-2"> Quantity:</label>
          <div className="border space-x-3 rounded-lg bg-gray-100">
            <button
              onClick={handleDecrement}
              className="bg-gray-400 text-gray-800 px-1 font-bold rounded hover:bg-gray-500 transition"
            >
              -
            </button>
            <span className="mx-2">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="bg-gray-400 text-gray-800 font-bold px-1 rounded hover:bg-gray-500 transition"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleCart}
        className="py-2.5 px-5 ml-4 mb-2 text-sm font-medium text-white focus:outline-none bg-black rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default Card;
