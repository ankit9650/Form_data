import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required("Cannot be empty!"),
    });

    const initialValues = {
        username: '',
        password: ''
    };

    const onSubmit = async (values) => {
        const notifySuccess = () => toast.success("Login Successful!");
        const notifyError = (message) => toast.error(message || "Login Failed");
    
        try {
            const logResponse = await axios.post('http://localhost:5000/login', values);
            
            if (logResponse.status === 200) {
                const { token, userType } = logResponse.data;
                console.log("Token value checking:", token);
                localStorage.setItem('jwtToken', token);
                notifySuccess();    
                navigate("/data");
             
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            
            if (error.response && error.response.data) {
                notifyError(error.response.data);
            } else {
                notifyError();
            }
        }
    };
    
    

    return (
        <>
            <ToastContainer />
            <div className='flex items-center justify-center min-h-screen bg-gray-100'>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {() => (
                        <div className="text-center bg-white w-96 h-full shadow-md shadow-gray-500 rounded-3xl p-6">
                            <h1 className='text-2xl font-extrabold mb-8'>Login</h1>
                            <Form>
                                <div>
                                    <label htmlFor="username" className='block text-sm font-medium text-gray-700'>Username:</label>
                                    <Field
                                        name="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                    />
                                    <ErrorMessage name='username' component="div" className='text-red-600' />
                                </div>
                                <div>
                                    <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Password:</label>
                                    <Field
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                    />
                                    <ErrorMessage name='password' component="div" className='text-red-600' />
                                </div>

                                <div className='text-right mt-2'>
                                    <Link to="/register" className='hover:text-blue-700 hover:underline'>
                                        Register?
                                    </Link>
                                </div>
                                
                                <button type='submit' className='mt-4 bg-blue-500 text-white rounded-lg p-2'>
                                    Login
                                </button>
                            </Form>
                        </div>
                    )}
                </Formik>
            </div>
        </>
    );
}

export default Login;
