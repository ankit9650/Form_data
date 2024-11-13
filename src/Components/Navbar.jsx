import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Navbar() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu toggle

  // Get cart items count
  const cartCount = useSelector((state) => state.cart.items.length);

  // User logged in check (JWT token)
  const isLoggedIn = !!localStorage.getItem('jwtToken');

  // Fetch user data from API if logged in
  const fetchData = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://localhost:5000/register', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResults(response.data);
    } catch (error) {
      setError('Error fetching data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoggedIn]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  // Navigation functions
  const handleProduct = () => navigate('/product');
  const handleEditProfile = () => navigate('/data');
  const handleCart = () => navigate('/cart');

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 transition duration-300 ease-in-out">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo and Avatar */}
        <Link to="/home" className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-teal-600 flex justify-center items-center">
            {isLoggedIn && results.length > 0 ? (
              <img
                src={`http://localhost:5000${results[0]?.Avatar}`}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">N/A</span>
            )}
          </div>
        </Link>

        {/* Error Message */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Hamburger icon for mobile */}
        <button
          className=" bg-black lg:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle mobile menu
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Menu Links (Products, Edit Profile) */}
        <div className="hidden lg:flex flex-grow justify-center space-x-6">
          {isLoggedIn && (
            <>
              <button
                type="button"
                onClick={handleProduct}
                className="text-white bg-teal-600 hover:bg-teal-500 focus:ring-4 focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
              >
                Products
              </button>
              <button
                type="button"
                onClick={handleEditProfile}
                className="text-white bg-teal-600 hover:bg-teal-500 focus:ring-4 focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
              >
                Edit Profile
              </button>
              
              <div className="ml-auto flex items-center space-x-4">
          {isLoggedIn && (
            <>
              {/* Cart Icon */}
              <button
                type="button"
                onClick={handleCart}
                className="relative flex items-center text-white bg-teal-600 hover:bg-teal-500 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
              >
                <span className="mr-2">Cart</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <sup className="absolute -top-2 -right-2 text-xs text-white bg-teal-500 rounded-full px-1">
                  {cartCount}
                </sup>
              </button>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="text-white  bg-teal-600 hover:bg-teal-500 focus:ring-4 focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
            </>
          )}
        </div>

        {/* Cart and Logout */}

      </div>

      {/* Dropdown Menu for Mobile */}
      <div
        className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-teal-600 p-4 space-y-4`}
      >
        {isLoggedIn && (
          <>
            <button
              type="button"
              onClick={handleProduct}
              className="w-full text-white text-center bg-teal-500 hover:bg-teal-400 focus:ring-4 focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
            >
              Products
            </button>
            <button
              type="button"
              onClick={handleEditProfile}
              className="w-full text-white text-center bg-teal-500 hover:bg-teal-400 focus:ring-4 focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={handleCart}
              className="w-full text-white text-center bg-teal-500 hover:bg-teal-400 focus:ring-4 focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
            >
              Cart ({cartCount})
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-white text-center bg-teal-500 hover:bg-teal-400 focus:ring-4 focus:ring-teal-200 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
