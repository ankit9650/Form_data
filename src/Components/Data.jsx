import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Data = () => {
  const [loginData, setLoginData] = useState([]);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', phone: '', hobbies: '' });

  useEffect(() => {
    const logData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/form');
        setLoginData(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };
    logData();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/form/${userId}`);
      setLoginData(loginData.filter(user => user.id !== userId));
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, phone: user.phone, hobbies: user.hobbies.join(', ') });
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = { ...formData, hobbies: formData.hobbies.split(',').map(hobby => hobby.trim()) };
      const response = await axios.put(`http://localhost:5000/form/${editingUser.id}`, updatedUser);
      setLoginData(loginData.map(user => (user.id === editingUser.id ? response.data : user)));
      setEditingUser(null);
      setFormData({ username: '', email: '', phone: '', hobbies: '' });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className="relative overflow-x-auto">
          <h1 className='text-center font-extrabold px-5 py-5 text-4xl'>User Data</h1>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Username</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3">Hobbies</th>
              <th scope="col" className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loginData.map((item) => (
              <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.username}</td>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4">{item.phone}</td>
                <td className="px-6 py-4">{Array.isArray(item.hobbies) && item.hobbies.length > 0 ? item.hobbies.join(', ') : 'No hobbies available'}</td>
                
                <td className="flex space-x-8  border px-6 py-4">
                  <button onClick={() => handleDelete(item.id)} className='flex items-center bg-transparent hover:bg-red-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-xl'>
                    Delete
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                  <button onClick={() => handleEdit(item)} className='flex items-center bg-transparent hover:bg-green-700 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-xl'>
                    Edit
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-2 size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingUser && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Edit User</h2>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="border p-2 m-2"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 m-2"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 m-2"
            />
            <input
              type="text"
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              placeholder="Hobbies (comma separated)"
              className="border p-2 m-2"
            />
            <button onClick={handleUpdate} className="bg-blue-500 text-white py-2 px-4 rounded">Update</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Data;
