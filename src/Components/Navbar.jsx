import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize logged-in state

  const handleToggleLogin = () => {
    setIsLoggedIn(prev => !prev); // Toggle the logged-in state
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/home" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-white font-semibold">
            AP
          </div>
        </Link>

        <div className="hidden md:flex md:justify-center flex-grow">
          <ul className="flex space-x-8 font-medium p-4 md:p-0 bg-gray-50 md:bg-transparent dark:bg-gray-800">
            <li>
              <NavLink
                to='/form'
                className={({ isActive }) =>
                  `block py-2 px-3 rounded ${isActive ? 'bg-gray-100' : 'text-gray-900'}`
                }
              >
                Form
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/data"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded ${isActive ? 'bg-gray-100' : 'text-gray-900'}`
                }
              >
                Data
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="ml-auto">
          <Link to="/login">
          <button
            type="button"
            onClick={handleToggleLogin}
            className="text-white bg-gray-700 hover:bg-gray-500 font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            {isLoggedIn ? 'Logout' : 'Login'} 
          </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
