import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:5000/form");
            
            setResults(response.data);
        } catch (error) {
            setError("Error fetching data. Please try again.");
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    const isLoggedIn = !!localStorage.getItem('jwtToken');

    return (
        <nav className="bg-white dark:bg-gray-900 fixed w-full border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/home" className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-white font-semibold">
                        {loading ? (
                            <span>Loading...</span>
                        ) : isLoggedIn && results.length > 0 ? (
                            <span>
                                {results[0].username.charAt(0).toUpperCase()}
                            </span>
                        ) : (
                            <span>N/A</span> 
                        )}
                    </div>
                </Link>

                {error && <div className="text-red-500">{error}</div>}

                <div className="ml-auto">
                    {isLoggedIn ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-white bg-gray-700 hover:bg-gray-500 font-medium rounded-lg text-sm px-4 py-2 text-center"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login">
                            <button
                                type="button"
                                className="text-white bg-gray-700 hover:bg-gray-500 font-medium rounded-lg text-sm px-4 py-2 text-center"
                            >
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
