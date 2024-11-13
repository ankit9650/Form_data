import React, { useEffect, useState } from 'react';
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
        password: Yup.string().required("Password is required"),
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
                const { token } = logResponse.data;
                localStorage.setItem('jwtToken', token);               
                notifySuccess();
                navigate("/home");
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

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const response = await axios.get('http://localhost:5000/register', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                });
                const token = localStorage.getItem('jwtToken');
                if (token) {
                    navigate("/data", { replace: true });
                }
            } catch (error) {
                console.error("Protected route", error);
            }
        };
        checkLoggedIn();
    }, [navigate]);

    return (
        <>
            <ToastContainer />
            <div className='flex items-center justify-center min-h-screen '>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {() => (
                        <div className="bg-white p-8 rounded-xl shadow-lg w-96">
                            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>
                            <Form>
                                <div className="mb-5">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                    <Field
                                        name="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage name='username' component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="mb-5">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <Field
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage name='password' component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="text-right mb-6">
                                    <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-800">
                                        Don't have an account? Register
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                                >
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
