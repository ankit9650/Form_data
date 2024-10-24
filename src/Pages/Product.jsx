import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Product() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Required'),
        unit: Yup.number().required('Required').positive().integer(),
        color: Yup.string().required('Required'),
        prodimg: Yup.mixed().required('Required'),
        price: Yup.number().required('Required').positive()
    });

    const initialValues = {
        title: '',
        unit: '',
        color: '',
        prodimg: null,
        price: ''
    };

    const handleAddProduct = async (values) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('unit', values.unit);
        formData.append('color', values.color);
        formData.append('prodimg', values.prodimg);
        formData.append('price', values.price);

        try {
            const response = await axios.post('http://localhost:5000/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                }
            });

            if (response.status === 200) {                
                navigate('/home');
                toast.success('Product added successfully!');
                console.log("Product added successfully!")
            } else {
                const errorMessage = response.data.message || 'Failed to add product';
                console.error('Failed to add product:', errorMessage);
                toast.error(`Failed to add product: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            const errorMessage = error.response?.data?.message || 'Error adding product.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

   
    

    return (
        <>
            <ToastContainer />
            <div className='flex items-center justify-center min-h-screen bg-gray-100'>
                <div className="bg-white shadow-md rounded-3xl p-8 max-w-lg w-full">
                    <h2 className="text-2xl mb-6 font-bold text-center">List your Product</h2>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleAddProduct}>
                        {({ setFieldValue }) => (
                            <Form>
                                <div className="mb-4">
                                    <label htmlFor="title" className='block text-sm font-medium text-gray-700'>Product Name:</label>
                                    <Field
                                        name="title"
                                        type="text"
                                        placeholder="Product Name"
                                        className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                    />
                                    <ErrorMessage name='title' component="div" className='text-red-600 text-sm' />
                                </div>

                                <div className="flex space-x-4 mb-4">
                                    <div className='flex-1'>
                                        <label htmlFor="unit" className='block text-sm font-medium text-gray-700'>Unit:</label>
                                        <Field
                                            name="unit"
                                            type="number"
                                            placeholder="0"
                                            className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                        />
                                        <ErrorMessage name='unit' component="div" className='text-red-600 text-sm' />
                                    </div>

                                    <div className='flex-1'>
                                        <label htmlFor="color" className='block text-sm font-medium text-gray-700'>Color:</label>
                                        <Field 
                                            as="select" 
                                            name="color"
                                            className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'>
                                            <option value="">Select Color</option>
                                            <option value="red">Red</option>
                                            <option value="green">Green</option>
                                            <option value="blue">Blue</option>
                                        </Field>
                                        <ErrorMessage name='color' component="div" className='text-red-600 text-sm' />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="prodimg" className='block text-sm font-medium text-gray-700'>Product Image:</label>
                                    <input
                                        name="prodimg"
                                        type="file"
                                        className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            setFieldValue("prodimg", file); 
                                        }}
                                    />
                                    <ErrorMessage name='prodimg' component="div" className='text-red-600 text-sm' />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="price" className='block text-sm font-medium text-gray-700'>Price:</label>
                                    <Field
                                        name="price"
                                        type="number"
                                        placeholder="₹ Enter price"
                                        className='mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                    />
                                    <ErrorMessage name='price' component="div" className='text-red-600 text-sm' />
                                </div>

                                <div className='flex space-x-3 mt-4'>
                                    <button type='button' className='border border-blue-600 bg-transparent text-black rounded-lg p-2 hover:bg-red-500 hover:text-white transition'>
                                        Cancel
                                    </button>
                                    <button type='submit' disabled={isSubmitting} className='bg-gray-800 text-white rounded-lg p-2 hover:bg-gray-700 transition'>
                                        {isSubmitting ? 'Adding...' : 'Add Product'}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
}

export default Product;
