import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Filter({ onFilterChange, isOpen, onClose }) {
  const [userNames, setUserNames] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedColor, setSelectedColor] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filters, setFilters] = useState({ userName: '', color: [], price: [0, 1000] });

  const navigate = useNavigate();

  const addedby = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/product', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        const names = response.data.map(product => product.userName);
        setUserNames([...new Set(names)]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    addedby();
  }, []);

  const handleUserNameChange = (e) => {
    const userName = e.target.value;
    setSelectedUserName(userName);
    setFilters((prev) => ({ ...prev, userName }));
  };

  const handleColorChange = (e) => {
    const { value, checked } = e.target;
    setSelectedColor((prev) => 
      checked ? [...prev, value] : prev.filter(color => color !== value)
    );
    setFilters((prev) => ({
      ...prev,
      color: checked ? [...prev.color, value] : prev.color.filter(color => color !== value)
    }));
  };

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    const newPriceRange = [0, value]; 
    setPriceRange(newPriceRange);
    setFilters((prev) => ({ ...prev, price: newPriceRange }));
  };

  const handleClearFilter = () => {
    setSelectedUserName('');
    setSelectedColor([]);
    setPriceRange([0, 1000]);
    setFilters({ userName: '', color: [], price: [0, 1000] });
    onFilterChange({ userName: '', color: [], price: [0, 1000] }); 
  };

  const handleApplyFilter = () => {
    onFilterChange(filters);
  };

  return (
    <aside className={`fixed top-0 left-0 w-72 min-h-screen bg-white shadow-lg transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        &times;
      </button>
      <h2 className='text-center text-2xl font-bold mb-4 mt-4'>Filter</h2>
      <ul className='space-y-4 p-4'>
        <li>
          <label htmlFor="price" className='block mb-1'>Price Range:</label>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            value={priceRange[1]} 
            onChange={handlePriceChange}
            className='w-full'
            step="10" 
          />
          <p>Price Range up to {priceRange[1]}</p>
        </li>

        <li>
          <label htmlFor="addedby" className='block mb-1'>Added By:</label>
          <select id="addedby" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={handleUserNameChange}>
            <option value="">Select Added By:</option>
            {userNames.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
        </li>

        <li>
          <label className='block mb-1'>Color:</label>
          <div className="flex flex-col space-y-2">
            {['red', 'green', 'blue'].map(color => (
              <div className="flex items-center" key={color}>
                <input id={`color-${color.toLowerCase()}`} type="checkbox" value={color} onChange={handleColorChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor={`color-${color.toLowerCase()}`} className="ml-2 text-sm font-medium text-gray-900">{color}</label>
              </div>  
            ))}
          </div>
        </li>

        <div className='mt-3 flex flex-row space-x-2'>
          <button className='border bg-blue-500 p-1 text-white rounded' onClick={handleClearFilter}>Clear Filters</button>
          <button className='border bg-green-500 p-1 text-white rounded' onClick={handleApplyFilter}>Apply Filters</button>
        </div>
      </ul>
    </aside>
  );
}

export default Filter;
