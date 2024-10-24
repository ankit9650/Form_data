
    // const handleEdit = (product) => {
    //     if (product) {
    //         setEditingProduct(product);
    //         setProdData({
    //             imgSrc: product.imgSrc,
    //             title: product.title,
    //             unit: product.unit,
    //             color: product.color,

    //         });
    //     } else {
    //         console.error("Product is undefined");
    //     }
    // };

    // const handleUpdate = async () => {
    //     if (!editingProduct) {
    //         console.error("No product is being edited");
    //         return;
    //     }

    //     try {
    //         const token = localStorage.getItem("jwtToken");
    //         const updatedProd = { ...prodData };
    //         const prodDataToSend = new FormData();
    //         prodDataToSend.append('title', updatedProd.title);
    //         prodDataToSend.append('unit', updatedProd.unit);
    //         prodDataToSend.append('color', updatedProd.color);
    //         if (updatedProd.imgSrc) {
    //             prodDataToSend.append('prodimg', updatedProd.imgSrc);
    //         }

    //         const response = await axios.put(`http://localhost:5000/product/${editingProduct.id}`, prodDataToSend, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });

    //         console.log('Updated product response:', response.data);
    //         setProducts(prevData =>
    //             prevData.map(product => (product.id === editingProduct.id ? response.data : product))
    //         );

    //         setEditingProduct(null);
    //         setProdData({ imgSrc: null, unit: '', color: '', title: '' });
    //     } catch (error) {
    //         console.error('Error updating Products:', error);
    //         toast.error('Error updating Products');
    //     }
    // };


    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setProdData(prevState => ({ ...prevState, [name]: value }));
    // };

    // const handleFileChange = (e) => {
    //     setProdData(prevState => ({ ...prevState, imgSrc: e.target.files[0] }));
    // };

    // const handleDelete = async (productid) => {
    //     console.log("Deleting product with ID:", productid);
    //     try {
    //         const token = localStorage.getItem("jwtToken");
    //         if (!token) {
    //             console.error("No token found.");
    //             return;
    //         }

    //         const notifySuccess = () => toast.success("Product deleted!");
    //         const response = await axios.delete(`http://localhost:5000/product/${productid}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })

    //         console.log('Delete response:', response.data);
            
    //         setProducts(products.filter(product => product.id !== productid));
    //         notifySuccess();
    //     } catch (error) {
    //         console.error('Error deleting product:', error);
    //         toast.error("Error deleting product");
    //     }
    // };

       {/* ################################# Edit Delete buttons ################################## */}
                {/* <div className="px-6 pt-4 pb-2 font-sans space-x-2">
                    <button type="button" className="border border-gray-700 p-1.5 rounded-md hover:bg-blue-600 hover:text-white font-semibold">
                        Buy Now
                    </button>
                    <button type="button" className="border border-gray-700 p-1.5 rounded-md hover:bg-gray-600 hover:text-white font-semibold">
                        Add to Cart
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDelete(productid)}
                        className="border border-gray-700 p-1.5 rounded-md hover:bg-red-600 hover:text-white font-semibold">
                        Delete
                    </button>



                    <button type="button" onClick={handleEdit} className="border border-gray-700 p-1.5 rounded-md hover:bg-green-600 hover:text-white font-semibold">
                        Edit
                    </button>

                    {editingProduct && (
                        <>
                            <h2 className="text-lg font-semibold mt-5">Edit Product</h2>
                            <div className='flex items-center justify-between mt-2 mb-2'>
                                <label htmlFor="" className='block text-sm font-medium text-gray-700'>Product Name
                                    <input name="title"
                                        type="text"
                                        placeholder="Product Name"
                                        onChange={handleChange}
                                        className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5' />
                                </label>
                                <label htmlFor="" className='block text-sm font-medium text-gray-700'>Color:
                                    <select name="color" onChange={handleChange} className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'>
                                        <option value="red">red</option>
                                        <option value="blue">blue</option>
                                        <option value="green">Green</option>
                                    </select>
                                </label>
                            </div>
                            <div className='flex space-x-3 items-center justify-between mt-2 mb-2'>
                                <label htmlFor="" className='block text-sm font-medium text-gray-700'>Unit
                                    <input name="unit"
                                        type="text"
                                        onChange={handleChange}
                                        placeholder="Unit"
                                        className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5' />
                                </label>
                                <label htmlFor="" className='block text-sm font-medium text-gray-700'>Image
                                    <input type="file"
                                        onChange={handleFileChange}
                                        className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2' />
                                </label>
                            </div>

                            <div className='mt-5'>
                                <button type="button" onClick={handleUpdate} className='w-full border border-gray-600 bg-transparent text-black rounded-lg p-2 hover:bg-gray-500 hover:text-white transition'>Update</button>
                            </div>
                        </>
                    )}
                </div> */}
