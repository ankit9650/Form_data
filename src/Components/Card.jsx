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
    <div className="max-w-xs border rounded-xl bg-white shadow-md hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 font-Poppins">
      <img className="w-full h-72 p-1 object-cover rounded-t-xl" src={`http://localhost:5000${imgSrc}`} alt={title} />
      <div className="p-6">
        <div className="font-semibold text-xl text-gray-900 capitalize mb-2">{title}</div>
        <div className="text-sm text-gray-500">Added By: {userName}</div>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
          <p className="text-sm">{color}</p>
          <p className="text-sm">Unit: {unit}</p>
          <p className="text-sm font-semibold">₹ {price}</p>
        </div>
        
        {/* Quantity Control */}
        <div className="flex items-center mt-4">
          <label className="text-gray-700 text-sm mr-2">Quantity:</label>
          <div className="flex items-center border rounded-xl bg-gray-100 px-4 py-1">
            <button
              onClick={handleDecrement}
              className="bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-gray-400"
            >
              -
            </button>
            <span className="mx-4 text-lg font-semibold">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-gray-400"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleCart}
        className="w-full py-3 px-6 text-sm font-semibold text-white bg-black rounded-xl mt-4 transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 block"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default Card;
