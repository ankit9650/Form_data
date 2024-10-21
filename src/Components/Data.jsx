import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Data = () => {
  const [loginData, setLoginData] = useState([]);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', phone: '', hobbies: '', avatar: null });
  const [userAccountType, setUserAccountType] = useState('');
  const navigate = useNavigate();

  const logData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.get('http://localhost:5000/register', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Response data:', response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        setLoginData(response.data);
        setUserAccountType(response.data[0].accountType);
      } else {
        setLoginData([response.data]);
        setUserAccountType(response.data.accountType);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("jwtToken");
        navigate('/login');
      } else {
        setError('Error fetching data');
      }
      console.error(err);
    }
  };

  useEffect(() => {
    logData();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const notifySuccess = () => toast.success("User deleted!");
      await axios.delete(`http://localhost:5000/register/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoginData(loginData.filter(user => user.id !== userId));
      notifySuccess();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone,
      hobbies: user.hobbies.join(', '),
      avatar: null
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const updatedUser = {
        ...formData,
        hobbies: formData.hobbies.split(',').map(hobby => hobby.trim())
      };

      const formDataToSend = new FormData();
      formDataToSend.append('username', updatedUser.username);
      formDataToSend.append('email', updatedUser.email);
      formDataToSend.append('phone', updatedUser.phone);
      formDataToSend.append('hobbies', JSON.stringify(updatedUser.hobbies));
      if (updatedUser.avatar) {
        formDataToSend.append('avatar', updatedUser.avatar);
      }

      const response = await axios.put(`http://localhost:5000/register/${editingUser.id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });


      console.log('Updated user response:', response.data);


      setLoginData(prevData =>
        prevData.map(user => (user.id === editingUser.id ? response.data : user))
      );

      setEditingUser(null);
      setFormData({ username: '', email: '', phone: '', hobbies: '', avatar: null });
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({ ...prevState, avatar: e.target.files[0] }));
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <ToastContainer />
      <div className="relative overflow-x-auto">
        <h1 className='text-center font-extrabold px-5 py-5 text-4xl'>User Data</h1>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Avatar</th>
              <th scope="col" className="px-6 py-3">Username</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3">Hobbies</th>
              <th scope="col" className="px-6 py-3">Account Type</th>
              <th scope="col" className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(loginData) && loginData.length > 0 ? (
              loginData.map((item) => (
                <tr key={item.id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>

                  <td className='px-6 py-4'>
                    <img
                      src={`http://localhost:5000${item.Avatar}`}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                  </td>

                  <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>{item.username}</td>
                  <td className='px-6 py-4'>{item.email}</td>
                  <td className='px-8 py-4'>{item.phone}</td>
                  <td className='px-8 py-4'>{Array.isArray(item.hobbies) ? item.hobbies.join(', ') : item.hobbies}</td>
                  <td className='px-6 py-4'>{item.accountType}</td>
                  <td className="flex space-x-8 border px-6 py-4">
                    {userAccountType === "Admin" && (
                      <button onClick={() => handleDelete(item.id)} className='flex items-center bg-transparent hover:bg-red-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-xl'>Delete</button>
                    )}
                    <button onClick={() => handleEdit(item)} className='flex items-center bg-transparent hover:bg-green-700 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-xl'>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No users found.</td>
              </tr>
            )}
          </tbody>

        </table>

        {editingUser && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Edit User</h2>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="border p-2 m-2" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 m-2" />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border p-2 m-2" />
            <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} placeholder="Hobbies " className="border p-2 m-2" />
            <input type="file" name="avatar" onChange={handleFileChange} className="border p-2 m-2" />
            <button onClick={handleUpdate} className="bg-blue-500 text-white py-2 px-4 rounded">Update</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Data;