import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isLoggedIn = !!localStorage.getItem('jwtToken');

    const fetchData = async () => {
        if (!isLoggedIn) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get("http://localhost:5000/register", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setResults(response.data);
        } catch (error) {
            setError("Error fetching data");
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    const handleAddProduct = () => {
        navigate('/product');
        console.log("Product added!!");
    };

    const handleEditProfile = () => {
        navigate('/data');
        console.log("Edited!!");
    };
    const handleCart = () => {
        navigate('/data');

    };

    return (
        <>
            <nav className="bg-white relative dark:bg-gray-900 fixed w-full border-b border-gray-200" >
                <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
                    <Link to="/home" className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 text-white font-semibold">
                            {isLoggedIn && results && results.length > 0 ? (
                                <img
                                    src={`http://localhost:5000${results[0]?.Avatar}`}
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full"
                                />
                            ) : (
                                <span>N/A</span>
                            )}
                        </div>
                    </Link>

                    {error && <div className="text-red-500">{error}</div>}

                    <div className="flex flex-grow justify-center space-x-4">
                        {isLoggedIn && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleAddProduct}
                                    className="text-white bg-gray-700 hover:bg-gray-500 font-medium rounded-lg text-sm px-4 py-2 text-center"
                                >
                                    Add Product
                                </button>
                                <button
                                    type="button"
                                    onClick={handleEditProfile}
                                    className="text-white bg-gray-700 hover:bg-gray-500 font-medium rounded-lg text-sm px-4 py-2 text-center"
                                >
                                    Edit Profile
                                </button>

                            </>
                        )}
                    </div>
                    <div className='ml-auto'>
                        {isLoggedIn && (
                            <>
                                <div className='space-x-2 '>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="text-white bg-gray-700 hover:bg-gray-500 font-medium rounded-lg text-sm px-4 py-2 text-center"
                                    >
                                        Logout
                                    </button>

                                    <button
                                        type='button'
                                        onClick={handleCart}
                                        className=' flex text-white bg-gray-700 hover:bg-gray-500 font-medium rounded-lg text-sm px-4 py-2 text-center'> Cart   
                                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>

                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
