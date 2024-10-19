import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const FormComponent = () => {
    const [adminExists, setAdminExists] = useState(false);
    const navigate = useNavigate();

    const notify = (message, type = 'success') => {
        if (type === 'error') {
            toast.error(message);
        } else {
            toast.success(message);
        }
    };

    useEffect(() => {
        const checkAdminExists = async () => {
            try {
                const response = await axios.get('http://localhost:5000/register', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
                });
                const adminAccount = response.data.some(user => user.accountType === "Admin");
                setAdminExists(adminAccount);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        checkAdminExists();
    }, []);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            phone: "",
            username: "",
            hobbies: [],
            gender: "",
            dob: "",
            accountType: "",
            Avatar: null 
        },

        validate: values => {
            const errors = {};
            const phoneRegExp = /^[0-9]{10}$/;
            const usernameRegExp = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
            const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const passRegExp = /^.{6}$/;

            if (!values.username) {
                errors.username = "Required..!"; 
            } else if (!usernameRegExp.test(values.username)) {
                errors.username = "Username invalid";
            }

            if (!values.email) {
                errors.email = "Required..!"; 
            } else if (!emailRegExp.test(values.email)) {
                errors.email = "Invalid email address"; 
            }

            if (!values.password) {
                errors.password = "Required..!"; 
            } else if (!passRegExp.test(values.password)) {
                errors.password = "Only 6 characters allowed"; 
            }

            if (!values.phone) {
                errors.phone = 'Phone number is required'; 
            } else if (!phoneRegExp.test(values.phone)) {
                errors.phone = 'Phone number must be 10 digits'; 
            }

            if (values.hobbies.length === 0) {
                errors.hobbies = 'At least one hobby must be selected'; 
            }

            if (!values.gender) {
                errors.gender = 'Gender is required'; 
            }

            if (!values.accountType) {
                errors.accountType = 'Account Type is required'; 
            }
            if (!values.Avatar) {
                errors.Avatar = 'Profile is required'; 
            }

            if (!values.dob) {
                errors.dob = 'Date of birth is required'; 
            } else if (new Date(values.dob) > new Date()) {
                errors.dob = "Date of birth cannot be in the future"; 
            }

            return errors;
        },

        onSubmit: async (values) => {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });

            try {
                await axios.post('http://localhost:5000/register', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                });
                notify("User Registered!");
                navigate("/login");
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    notify(error.response.data, 'error');
                } else {
                    console.error('Error submitting form:', error);
                    notify("An unexpected error occurred.", 'error');
                }
            }
        },
    });

   
    const handleFileChange = (event) => {
        formik.setFieldValue("Avatar", event.currentTarget.files[0]);
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <ToastContainer />
            <div className="text-center bg-white w-auto shadow-md shadow-gray-500 rounded-3xl h-full mt-32 mb-12 p-6">
                <h1 className='text-2xl font-extrabold mb-8'>Register</h1>
                <form onSubmit={formik.handleSubmit} enctype="multipart/form-data">
                    <div className="grid grid-cols-2 gap-4">
                        {/* username */}
                        <div>
                            <label htmlFor="username" className='block text-sm font-medium text-gray-700'>Username:</label>
                            <input
                                placeholder="username"
                                type="text"
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                                name="username"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.username}
                            />
                            <div className='text-red-600'>
                                {formik.touched.username && formik.errors.username ? formik.errors.username : null}
                            </div>
                        </div>
                        {/* email */}
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email:</label>
                            <input
                                placeholder="abc@gmail.com"
                                type="email"
                                name="email"
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            <div className='text-red-600'>
                                {formik.touched.email && formik.errors.email ? formik.errors.email : null}
                            </div>
                        </div>
                        {/* phone */}
                        <div>
                            <label htmlFor="phone" className='block text-sm font-medium text-gray-700'>Phone:</label>
                            <input
                                placeholder="0000111122"
                                type="text"
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                                name="phone"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phone}
                            />
                            <div className='text-red-600'>
                                {formik.touched.phone && formik.errors.phone ? formik.errors.phone : null}
                            </div>
                        </div>
                        {/* password */}
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Password:</label>
                            <input
                                placeholder="******"
                                type="password"
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                                name="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                            <div className='text-red-600'>
                                {formik.touched.password && formik.errors.password ? formik.errors.password : null}
                            </div>
                        </div>
                    </div>
                        {/* hobbies */}
                    <div className='flex flex-col items-center mt-5 mb-4'>
                        <label className='block text-xs font-medium text-gray-700'>HOBBIES:</label>
                        <div className='flex gap-4 items-center justify-center'>
                            <label htmlFor="">Travelling</label>
                            <input type="checkbox" name="hobbies" value="Travelling" onChange={formik.handleChange} />
                            <label htmlFor="">Cricket</label>
                            <input type="checkbox" name="hobbies" value="Cricket" onChange={formik.handleChange} />
                            <label htmlFor="">Singing</label>
                            <input type="checkbox" name="hobbies" value="Singing" onChange={formik.handleChange} />
                        </div>
                        <div className='text-red-600'>
                            {formik.touched.hobbies && formik.errors.hobbies ? formik.errors.hobbies : null}
                        </div>
                    </div>
                        {/* Gender */}
                    <div className='flex items-center justify-between mt-5 mb-4'>
                        <div className='flex-1 mr-2'>
                            <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.gender}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <div className='text-red-600'>
                                {formik.touched.gender && formik.errors.gender ? formik.errors.gender : null}
                            </div>
                        </div>

                        <div className='flex-1 ml-2'>
                            <label htmlFor="accountType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account Type:</label>
                            <select
                                id="accountType"
                                name="accountType"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.accountType}
                            >
                                {!adminExists && <option value="Admin">Admin</option>}
                                <option value="User">User</option>
                            </select>
                            <div className='text-red-600'>
                                {formik.touched.accountType && formik.errors.accountType ? formik.errors.accountType : null}
                            </div>
                        </div>
                    </div>
                   
                    <div className="flex flex-col items-center mt-5 mb-4">
                        <label htmlFor="Avatar" className="block mb-2 text-sm font-medium text-gray-900">Upload Profile:</label>
                        <input
                            type="file"
                            name="Avatar"
                            id="Avatar"
                            className='p-2.5'
                            onChange={handleFileChange}
                        />
                        <div className='text-red-600'>
                            {formik.touched.Avatar && formik.errors.Avatar ? formik.errors.Avatar : null}
                        </div>
                    </div>


                    {/* Gender Radio */}
                    {/* <div className='flex flex-col items-center mb-4'>
                        <label className='block text-xs font-medium text-gray-700'>GENDER:</label>
                        <div className='flex gap-4 items-center justify-center'>
                            <label htmlFor="">Male</label>
                            <input type="radio" name="gender" value="Male" onChange={formik.handleChange} />
                            <label htmlFor="">Female</label>
                            <input type="radio" name="gender" value="Female" onChange={formik.handleChange} />
                        </div>
                        <div className='text-red-600'>
                            {formik.touched.gender && formik.errors.gender ? formik.errors.gender : null}
                        </div>
                    </div> */}
                    
                    {/* DOB */}
                    <div className='mb-4'>
                        <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Date of Birth:</label>
                        <input
                            type="date"
                            name="dob"
                            className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.dob}
                        />
                        <div className='text-red-600'>
                            {formik.touched.dob && formik.errors.dob ? formik.errors.dob : null}
                        </div>
                    </div>

                    <button
                        type='submit'
                        className="inline-block rounded border border-indigo-600 bg-indigo-600 px-6 py-2 text-sm font-medium text-white"
                    >
                        Submit
                    </button>
                    <ToastContainer />



                </form>
            </div>
        </div>
    );
};

export default FormComponent;
