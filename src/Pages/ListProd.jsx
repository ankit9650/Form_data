import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ListProd = () => {
    const [prodData, setProdData] = useState([]);
    const [editingProd, setEditingProd] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const navigate = useNavigate();
    const fetchProducts = async () => {
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

            console.log("Fetched Products:", response.data);
            setProdData(Array.isArray(response.data) ? response.data : []);

            setProdData(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("jwtToken");
                navigate('/login');
            } else {
                toast.error('Error fetching data');
            }
            console.error(err);
        }
    };



    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/product/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });

            toast.success(response.data.message || 'Product deleted successfully');
            fetchProducts();
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data || 'An error occurred while deleting the product');
            } else {
                toast.error('Network error');
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProd(product);
        setProdData(prevState => ({
            ...prevState,
            title: product.title,
            color: product.color,
            unit: product.unit,
            prodimg: null
        }));
    };


    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const updatedProd = new FormData();
            updatedProd.append('title', prodData.title);
            updatedProd.append('color', prodData.color);
            updatedProd.append('unit', prodData.unit);

            if (prodData.prodimg) {
                updatedProd.append('prodimg', prodData.prodimg);
            }
            
            await axios.put(`http://localhost:5000/product/${editingProd.productid}`, updatedProd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            fetchProducts();
            setEditingProd(null);
            toast.success("Product updated!");
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Error updating product');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProdData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (e) => {
        setProdData(prevState => ({ ...prevState, prodimg: e.target.files[0] }));
    };

    const handleAddProduct = () => {
        navigate('/product/add');
    };

    // Pagination Logic
    const totalPages = Math.ceil(prodData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = prodData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100 mb-4'>
            <ToastContainer />
            <div className="relative w-3/4 overflow-x-auto">
                <h1 className='text-center font-extrabold px-5 py-5 text-4xl'>Products List</h1>
                <button className='p-1 bg-gray-700 font-semibold rounded text-white mb-1' onClick={handleAddProduct}>Add Product</button>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Product Image</th>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Unit</th>
                            <th scope="col" className="px-6 py-3">Color</th>
                            <th scope="col" className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.productid} className='bg-white border-b w-full dark:bg-gray-800 dark:border-gray-700'>
                                    <td className='px-6 py-4'>
                                        <img
                                            src={`http://localhost:5000${item.prodimg}`}
                                            alt="Product"
                                            className="w-12 h-12 rounded-full"
                                        />
                                    </td>
                                    <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>{item.title}</td>
                                    <td className='px-6 py-4'>{item.unit}</td>
                                    <td className='px-8 py-4'>{item.color}</td>
                                    <td className="flex items-center justify-center space-x-8 border px-6 py-4">
                                        <button onClick={() => handleDelete(item.productid)} className='flex items-center bg-transparent hover:bg-red-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-xl'>Delete</button>
                                        <button onClick={() => handleEdit(item)} className='flex items-center bg-transparent hover:bg-green-700 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-xl'>Edit</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No Product found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {editingProd && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold">Edit Product</h2>
                        <input type="text" name="title" value={prodData.title} onChange={handleChange} placeholder="Title" className="border p-2 m-2" />
                        <input type="text" name="color" value={prodData.color} onChange={handleChange} placeholder="Color" className="border p-2 m-2" />
                        <input type="text" name="unit" value={prodData.unit} onChange={handleChange} placeholder="Unit" className="border p-2 m-2" />
                        <input type="file" name="prodImg" onChange={handleFileChange} className="border p-2 m-2" />
                        <button onClick={handleUpdate} className="bg-blue-500 text-white py-2 px-4 rounded">Update</button>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    <div className='border p-1 border-gray-700 bg-gray-200 rounded-lg mb-1  '>
                        {Array.from({ length: totalPages }, (_, index) => (

                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`mx-2 p-2 rounded ${currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                            >
                                {index + 1}
                            </button>

                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ListProd;
