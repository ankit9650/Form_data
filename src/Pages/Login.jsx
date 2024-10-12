import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Login() {                                                                                      

    const passReg = /^.{6,}$/; // At least 6 characters
    const usernameReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,10}$/;

    const validationSchema = Yup.object().shape({
        username: Yup.string().matches(usernameReg, "Eg:- abc123 ")
            .required('Username is required'),
        password: Yup.string()
            .matches(passReg, "Password must be at least 6 characters long")
            .required("Cannot be Empty!"),
    });

    const initialValues = {
        username: '',
        password: ''
    };
  

    const onSubmit = async (values) => {
        const notifySuccess = () => toast.success("Login Successful!");
        const notifyError = () => toast.error("Login Failed");
    
        console.log('Form data', values);
        try {
            const logResponse = await axios.post('http://localhost:5000/login', values);
            if (logResponse.status === 200) {
                notifySuccess();
                
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            notifyError();
            
        }
    };
    

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {() => (
                    <div className="text-center bg-white w-96 h-full shadow-md rounded p-6">
                        <h1 className='text-2xl font-extrabold mb-8'>Login</h1>
                        <Form>
                            <div>
                                <label htmlFor="username" className='block text-sm font-medium text-gray-700'>Username:</label>
                                <Field
                                    name="username"
                                    type="text"
                                    placeholder="username"
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                />
                                <ErrorMessage name='username' component="div" className='text-red-600' />
                            </div>
                            <div>
                                <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Password:</label>
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="password"
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
                                />
                                <ErrorMessage name='password' component="div" className='text-red-600' />
                            </div>
                            <button type='submit' className='mt-4 bg-blue-500 text-white rounded-lg p-2'>
                                Login
                            </button>
                            <ToastContainer />
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    );
}

export default Login;
