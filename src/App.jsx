import React from 'react';
import { Form, Formik, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';



const FormComponent = () => {
  const initialValues = {
    email: "",
    password: "",
    phone: "",
    username: "",
    hobbies: [],
    gender: "",
    dob: "",
  };

  // Regex patterns
  const phoneRegExp = /^[0-9]{10}$/;
  const usernameRegExp = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
  const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passRegExp = /^.{6}$/;

  // validation Schema
  const validationSchema = Yup.object({
    username: Yup.string().matches(usernameRegExp, 'Username invalid').required("Required..!"),
    email: Yup.string().matches(emailRegExp, 'Invalid email address').required("Required..!"),
    password: Yup.string().matches(passRegExp, 'Only 6 characters allowed').required("Required..!"),
    phone: Yup.string().matches(phoneRegExp, 'Phone number must be 10 digits').required('Phone number is required'),
    hobbies: Yup.array().min(1, 'At least one hobby must be selected'),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.date().required('Date of birth is required')
      .max(new Date(), "Date of birth cannot be in the future"),
  });
  
  const onSubmit = values => {
    alert("Submitted!")
    console.log('form data', values);   
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center  bg-white w-auto h-full shadow-md rounded p-6">
        <h1 className='text-2xl font-extrabold mb-8'>Form</h1>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {formik => (
            <Form>
              <label htmlFor="" className='block text-sm font-medium text-gray-700'>Username:</label>
              <Field placeholder="username" type="text" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' name="username" /><br />
              <div className='text-red-600'>
                <ErrorMessage
                  name='username'
                />
              </div>
              <label htmlFor="" className='block text-xs font-medium text-gray-700'>email:</label>
              <Field placeholder="abc@gmail.com" type="email" name="email" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' /><br />
              <div className='text-red-600'>
                <ErrorMessage
                  name='email'
                />
              </div>
              <label htmlFor="" className='block text-xs font-medium text-gray-700'>phone:</label>
              <Field placeholder="0000111122" type="phone" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' name="phone" /><br />
              <div className='text-red-600' >
                <ErrorMessage
                  name='phone'

                />
              </div>
              <label htmlFor="" className='block text-xs font-medium text-gray-700'>Password:</label>
              <Field placeholder="******" type="password" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' name="password" /><br />
              <div className='text-red-600'>
                <ErrorMessage
                  name='password'

                />
              </div>
              <div className='flex flex-col items-center mb-4'>
                <label htmlFor="" className='block text-xs font-medium text-gray-700'>HOBBIES:</label>
                <div className='flex gap-4 items-center justify-center'>
                  <label htmlFor="">Travelling</label>
                  <Field type="checkbox" name="hobbies" value="Travelling" />
                  <label htmlFor="">Cricket</label>
                  <Field type="checkbox" name="hobbies" value="Cricket" />
                  <label htmlFor="">Singing</label>
                  <Field type="checkbox" name="hobbies" value="Singing" />
                </div>
                <div className='text-red-600'>
                  <ErrorMessage
                    name="hobbies"
                  />
                </div>
              </div>

              <div className='flex flex-col items-center mb-4'>
                <label htmlFor="" className='block text-xs font-medium text-gray-700'>GENDER:</label>

                <div className='flex gap-4 items-center justify-center'>
                  <label htmlFor="">Male</label>
                  <Field type="radio" name="gender" value="Male" />
                  <label htmlFor="">Female</label>
                  <Field type="radio" name="gender" value="Female" />
                </div>
                <div className='text-red-600'>
                  <ErrorMessage
                    name='gender'

                  />
                </div>
              </div>

              <div className='mb-0'>
                <label htmlFor="" className='block text-xs font-medium text-gray-700'>DOB:</label>
                <Field type="date" name="dob" />
              </div>
              <div className='text-red-600'>
                <ErrorMessage
                  name='dob'

                />
              </div>
              <br />
              <button
                type='submit'
                className="inline-block rounded border border-indigo-600 bg-indigo-600 px-6 py-2 text-sm font-medium text-white"
                
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FormComponent;
