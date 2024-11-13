import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ListProd = () => {
    const [prodData, setProdData] = useState([]);
    const [editingProd, setEditingProd] = useState(null);
    const [editFormData, setEditFormData] = useState({ title: '', color: '', unit: '', prodimg: null, price: '' });
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

            setProdData(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("jwtToken");
                navigate('/login');
            } else {
                toast.error('Error fetching data');
            }
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
            toast.error(error.response ? error.response.data : 'Error deleting product');
        }
    };

    const handleEdit = (product) => {
        setEditingProd(product);
        setEditFormData({
            title: product.title,
            color: product.color,
            unit: product.unit,
            prodimg: null,
            price: product.price
        });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            const updatedProd = new FormData();
            updatedProd.append('title', editFormData.title);
            updatedProd.append('color', editFormData.color);
            updatedProd.append('unit', editFormData.unit);
            updatedProd.append('price', editFormData.price);
            
            if (editFormData.prodimg) {
                updatedProd.append('prodimg', editFormData.prodimg);
            }

            await axios.put(`http://localhost:5000/product/${editingProd.productid}`, updatedProd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            fetchProducts();
            setEditingProd(null);
            setEditFormData({ title: '', color: '', unit: '', prodimg: null, price: '' });
            toast.success("Product updated!");
        } catch (error) {
            toast.error('Error updating product');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (e) => {
        setEditFormData(prevState => ({ ...prevState, prodimg: e.target.files[0] }));
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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <ToastContainer />
            <div className="w-full max-w-7xl mt-32 p-5 mb-5 bg-white shadow-lg rounded-lg">
                <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">Product List</h1>

                <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
                    onClick={handleAddProduct}
                >
                    Add New Product
                </button>

                <table className="min-w-full bg-white text-center shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 text-left">Image</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Unit</th>
                            <th className="px-6 py-3">Color</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.productid} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img
                                            src={`http://localhost:5000${item.prodimg}`}
                                            alt="Product"
                                            className="w-12 h-12 object-cover rounded-full"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                                    <td className="px-6 py-4">{item.unit}</td>
                                    <td className="px-6 py-4">{item.color}</td>
                                    <td className="px-6 py-4">₹{item.price}</td>
                                    <td className="px-6 py-4 text-center space-x-3">
                                        <button
                                            onClick={() => handleDelete(item.productid)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {editingProd && (
                    <div className="mt-6 p-5 border-t">
                        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                value={editFormData.title}
                                onChange={handleChange}
                                placeholder="Product Title"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                name="color"
                                value={editFormData.color}
                                onChange={handleChange}
                                placeholder="Color"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                name="unit"
                                value={editFormData.unit}
                                onChange={handleChange}
                                placeholder="Unit"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                name="price"
                                value={editFormData.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="file"
                                name="prodimg"
                                onChange={handleFileChange}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                            <button
                                onClick={handleUpdate}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Update Product
                            </button>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-6 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListProd;
