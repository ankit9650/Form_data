import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Checkout() {
  
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.id); 
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      cardNumber: '',
      expDate: '',
      cvv: '',
      upiId: '', 
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Phone number is required'),
      streetAddress: Yup.string().required('Street address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zipCode: Yup.string().matches(/^\d{6}$/, 'Invalid zip code').required('Zip code is required'),
      cardNumber: paymentMethod === 'card' ? Yup.string().matches(/^\d{16}$/, 'Invalid card number').required('Card number is required') : Yup.string(),
      expDate: paymentMethod === 'card' ? Yup.string().matches(/^\d{2}\/\d{2}$/, 'Invalid expiration date').required('Expiration date is required') : Yup.string(),
      cvv: paymentMethod === 'card' ? Yup.string().matches(/^\d{3}$/, 'Invalid CVV').required('CVV is required') : Yup.string(),
      upiId: paymentMethod === 'gpay' ? Yup.string().email('Invalid UPI ID').required('UPI ID is required') : Yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className="font-sans bg-white p-4">
      <div className="max-w-4xl mt-28 mx-auto">
        <div className="text-center">
          <h2 className="text-3xl  font-extrabold text-gray-800 inline-block border-b-[3px] border-gray-800 pb-1">Checkout</h2>
        </div>

        {/* Personal Details */}
        <div className="mt-12">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-3xl font-bold text-gray-300">01</h3>
              <h3 className="text-xl font-bold text-gray-800 mt-1">Personal Details</h3>
            </div>
            <div className="md:col-span-2">
              <form onSubmit={formik.handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}
                    />
                    {formik.touched.firstName && formik.errors.firstName ? (
                      <div className="text-red-600 text-xs">{formik.errors.firstName}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                      <div className="text-red-600 text-xs">{formik.errors.lastName}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-600 text-xs">{formik.errors.email}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone number"
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phoneNumber}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                      <div className="text-red-600 text-xs">{formik.errors.phoneNumber}</div>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Shopping Address */}
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-300">02</h3>
              <h3 className="text-xl font-bold text-gray-800 mt-1">Shopping Address</h3>
            </div>
            <div className="md:col-span-2">
              <form>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="streetAddress"
                      placeholder="Street address"
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.streetAddress}
                    />
                    {formik.touched.streetAddress && formik.errors.streetAddress ? (
                      <div className="text-red-600 text-xs">{formik.errors.streetAddress}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.city}
                    />
                    {formik.touched.city && formik.errors.city ? (
                      <div className="text-red-600 text-xs">{formik.errors.city}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.state}
                    />
                    {formik.touched.state && formik.errors.state ? (
                      <div className="text-red-600 text-xs">{formik.errors.state}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip Code"
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.zipCode}
                    />
                    {formik.touched.zipCode && formik.errors.zipCode ? (
                      <div className="text-red-600 text-xs">{formik.errors.zipCode}</div>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Payment Method */}
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-300">03</h3>
              <h3 className="text-xl font-bold text-gray-800 mt-1">Payment method</h3>
            </div>
            <div className="md:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    className="w-5 h-5 cursor-pointer"
                    id="card"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={handlePaymentChange}
                  />
                  <label htmlFor="card" className="ml-4 flex gap-2 cursor-pointer">
                    <img src="https://readymadeui.com/images/visa.webp" className="w-12" alt="card1" />
                    <img src="https://readymadeui.com/images/american-express.webp" className="w-12" alt="card2" />
                    <img src="https://readymadeui.com/images/master.webp" className="w-12" alt="card3" />
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    className="w-5 h-5 cursor-pointer"
                    id="gpay"
                    name="payment"
                    checked={paymentMethod === 'gpay'}
                    onChange={handlePaymentChange}
                  />
                  <label htmlFor="gpay" className="ml-4 flex gap-2 cursor-pointer">
                    <img src="https://img.icons8.com/?size=100&id=BsiNqIHwKUq8&format=png&color=000000" className="w-14" alt="gpayCard" />
                  </label>
                </div>
              </div>

              {paymentMethod === 'gpay' && (
                <div className="mt-4">
                  <input
                    type="text"
                    name="upiId"
                    placeholder="Enter your UPI ID"
                    className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.upiId}
                  />
                  {formik.touched.upiId && formik.errors.upiId ? (
                    <div className="text-red-600 text-xs">{formik.errors.upiId}</div>
                  ) : null}
                </div>
              )}

              {/* Card details fields */}
              {paymentMethod !== 'gpay' && (
                <div className="grid sm:grid-cols-4 gap-4 mt-4">
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card number"
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.cardNumber}
                    />
                    {formik.touched.cardNumber && formik.errors.cardNumber ? (
                      <div className="text-red-600 text-xs">{formik.errors.cardNumber}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="expDate"
                      placeholder="EXP."
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.expDate}
                    />
                    {formik.touched.expDate && formik.errors.expDate ? (
                      <div className="text-red-600 text-xs">{formik.errors.expDate}</div>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      className="px-4 py-3 bg-white text-gray-800 w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.cvv}
                    />
                    {formik.touched.cvv && formik.errors.cvv ? (
                      <div className="text-red-600 text-xs">{formik.errors.cvv}</div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="flex flex-wrap justify-end gap-4 w-full mt-12">
            <button type="submit" className="px-6 py-3 text-sm w-full font-semibold tracking-wide bg-blue-600 text-white rounded-md hover:bg-blue-700">Pay now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
