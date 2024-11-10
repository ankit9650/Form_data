import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity } from '../Features/Cart/cart'; 

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const handleRemoveFromCart = (productid) => {
    dispatch(removeFromCart(productid));
  };

  const handleIncrement = (productid, quantity) => {
    dispatch(updateQuantity({ productid, quantity: quantity + 1 }));
  };

  const handleDecrement = (productid, quantity) => {
    if (quantity > 1) {
      dispatch(updateQuantity({ productid, quantity: quantity - 1 }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      return '₹ 0.00';  
    }
    return `₹ ${numericPrice.toFixed(2)}`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center font-Poppins mb-4">Your Cart</h1>
      <hr className="mb-4 shadow-sm" />
      
      {cartItems.length === 0 ? (
        <div className="border shadow-lg bg-white rounded-2xl p-4 border-b">
          <p className="text-center font-Poppins font-bold mb-7">Your cart is empty</p>
          <Link to="/home">
            <p className="text-center text-sm text-blue-600 font-Poppins font-bold">Continue Shopping</p>
          </Link>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.productid} className="flex items-center border shadow-lg bg-white mb-3 rounded-2xl justify-between p-4 border-b">
              <img
                src={`http://localhost:5000${item.imgSrc}`}
                alt={item.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <p className="text-xl font-semibold">{item.title}</p>
                <p>Color: {item.color}</p>
                <p>Unit: {item.unit}</p>
                <p>{formatPrice(item.price)}</p>
                
                {/* Quantity Controls */}
                <div className="flex items-center mt-2">
                  <label htmlFor="" className='mr-2'> Quantity:</label>
                  <div className='border space-x-4 py-1 px-1 rounded-lg bg-gray-100'>
                    <button                   
                      onClick={() => handleDecrement(item.productid, item.quantity)}
                      className="bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded hover:bg-gray-500 transition"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrement(item.productid, item.quantity)}
                      className="bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded hover:bg-gray-500 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.productid)}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* total price and checkout button */}
      {cartItems.length > 0 && (
        <div className="mt-6 text-right">
          <p className="font-bold text-lg">
            Total: ₹ {calculateTotal()}
          </p>
          <Link to="/checkout">
            <button className="border border-gray-700 p-2 rounded-lg mt-4 bg-blue-500 text-white hover:bg-blue-600">
              Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
