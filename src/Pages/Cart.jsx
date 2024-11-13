import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, setCartItems } from '../Features/Cart/cart'; 
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const userId = localStorage.getItem('userId');  // Assuming userId is stored in localStorage after login

  // Fetch cart items from the backend on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const response = await axios.get(`http://localhost:5000/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          // Sync cart items with Redux store
          dispatch(setCartItems(response.data));
        } else {
          navigate('/login'); // Redirect to login if no token is found
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Failed to load cart items');
      }
    };

    fetchCartItems();
  }, [dispatch, navigate]);

  const handleRemoveFromCart = async (productid) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        toast.error('User not authenticated');
        return;
      }
  
      const response = await axios.delete(`http://localhost:5000/cart/${productid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        dispatch(removeFromCart(productid)); 
        toast.success('Product removed from cart.');
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Failed to remove item from cart');
    }
  };
  

  // Handle updating product quantity
  const handleIncrement = (productid, quantity) => {
    dispatch(updateQuantity({ productid, quantity: quantity + 1 }));
  };

  const handleDecrement = (productid, quantity) => {
    if (quantity > 1) {
      dispatch(updateQuantity({ productid, quantity: quantity - 1 }));
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    return `₹ ${numericPrice.toFixed(2)}`;
  };

  return (
    <>
    <ToastContainer/>
    <div className="container mx-auto mt-20 px-4 py-6">
      <h1 className="text-4xl font-extrabold text-black text-center mb-6">
        Shopping Cart
      </h1>
      <hr className="mb-6 border-gray-300" />

      {cartItems.length === 0 ? (
        <div className="border shadow-lg bg-white rounded-2xl p-6 flex flex-col items-center">
          <p className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</p>
          <Link to="/home">
            <p className="text-sm text-blue-600 hover:underline">Continue Shopping</p>
          </Link>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.productid} className="flex items-center border-b shadow-md bg-white mb-4 rounded-2xl p-4 hover:bg-gray-50 transition duration-300 ease-in-out">
              <img
                src={`http://localhost:5000${item.imgSrc}`}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1 ml-6">
                <p className="text-lg font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">Color: {item.color}</p>
                <p className="text-sm text-gray-500">Unit: {item.unit}</p>
                <p className="text-xl font-semibold text-gray-900 mt-2">{formatPrice(item.price)}</p>
                
                {/* Quantity Controls */}
                <div className="flex items-center mt-3">
                  <label htmlFor="" className="mr-3 text-sm text-gray-600">Quantity:</label>
                  <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                    <button
                      onClick={() => handleDecrement(item.productid, item.quantity)}
                      className="bg-gray-400 text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-500 transition"
                    >
                      -
                    </button>
                    <span className="mx-4 text-lg font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrement(item.productid, item.quantity)}
                      className="bg-gray-400 text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-500 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Remove Button */}
              <button
                onClick={() => handleRemoveFromCart(item.productid)}
                className="text-red-600 hover:text-red-800 ml-6 text-sm font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total Price and Checkout Button */}
      {cartItems.length > 0 && (
        <div className="mt-8 text-right">
          <p className="text-2xl font-semibold text-gray-900 mb-4">
            Total: {formatPrice(calculateTotal())}
          </p>
          <Link to="/payment">
            <button className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}                                                
    </div>
    </>
  );
}

export default Cart;
