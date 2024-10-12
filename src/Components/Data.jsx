import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Data = () => {
  const [loginData, setLoginData] = useState([]);  
  const [error, setError] = useState(null); 
 
  useEffect(() => {
    const logData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/login'); 
        setLoginData(response.data); 
      } catch (err) {
        setError('Error fetching data'); 
        console.error(err);
      }
    };
    logData(); 
  }, []);

  

  

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Password
              </th>
            </tr>
          </thead>
          <tbody>
            {loginData.map((item) => (
              <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item.username}
                </td>
                <td className="px-6 py-4">
                  {item.password}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Data;
