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
      <div className="max-w-7xl mx-auto p-6 mt-32 bg-white rounded-xl shadow-md my-5">
        <h1 className="text-center font-extrabold px-5 py-5 text-4xl mb-6">Users Information</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loginData && loginData.length > 0 ? (
            loginData.map((user) => (
              <div key={user.id} className="bg-white p-6 rounded-lg shadow-lg border hover:shadow-lg transition-all">
                <img
                  src={`http://localhost:5000${user.Avatar}`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-center text-xl font-semibold text-gray-800">{user.username}</h3>
                <p className="text-center text-gray-600"><strong>Email:</strong> {user.email}</p>
                <p className="text-center text-gray-600"><strong>Phone:</strong> {user.phone}</p>
                <p className="text-center text-gray-600"><strong>Hobbies:</strong> {Array.isArray(user.hobbies) ? user.hobbies.join(', ') : user.hobbies}</p>
                <p className="text-center text-gray-600"><strong>Account Type:</strong> {user.accountType}</p>
                <div className="mt-4 flex justify-center gap-4">
                  {userAccountType === "Admin" && (
                    <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white py-2 px-4 rounded-lg">Delete</button>
                  )}
                  <button onClick={() => handleEdit(user)} className="bg-green-500 text-white py-2 px-4 rounded-lg">Edit</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No users found.</p>
          )}
        </div>

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
