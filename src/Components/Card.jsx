import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Card({ imgSrc, title, color, userName, unit, productid }) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState([]);
    const productData = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:5000/product', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Response data:', response.data);

            if (Array.isArray(response.data) && response.data.length > 0) {
                setProducts(response.data);
            } else {
                setProducts([]);
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("jwtToken");
                navigate('/login');
            } else {
                setError('Error fetching data');
            }
            console.error(err);
        }
    };

    useEffect(() => {
        productData();
    }, []);


    return (
        <>
            <div>
                    
                    <div className="max-w-sm bg-white rounded-lg overflow-hidden font-Poppins shadow-md shadow-black p-1">
                        <img className="w-full h-72 rounded shadow" src={`http://localhost:5000${imgSrc}`} alt={title} />
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-1">{title}</div>
                            <div className="font-semibold text-md mb-2">Added By: {userName}</div>
                            <p className="text-gray-700 text-base">{color}</p>
                            <p className="text-gray-700 text-base">Unit:{unit}</p>
                        </div>
                    </div>
       
            </div>
            
        </>
    );
}

export default Card;
