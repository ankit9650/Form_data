import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Card from '../Components/Card';
import Filter from '../Components/Filter';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/product', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data || []);
      setFilteredProducts(response.data || []);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("jwtToken");
        navigate('/login');
      } else {
        setError('Error fetching data');
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = ({ userName, color, price }) => {
    let filtered = [...products];

    if (userName) {
      filtered = filtered.filter(product => product.userName === userName);
    }

    if (color.length > 0) {
      filtered = filtered.filter(product => color.includes(product.color));
    }

    if (price) {
      const [minPrice, maxPrice] = price;
      filtered = filtered.filter(product => {
        const productPrice = parseFloat(product.price);
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    }

   
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    handleFilterChange({ userName: null, color: [], price: null });
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleFilterDrawer = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <div className="relative flex h-full">
        <Filter isOpen={isFilterOpen} onClose={toggleFilterDrawer} onFilterChange={handleFilterChange} />
        
        <div className="flex-grow p-4 transition-all duration-300">
          <div className="bg-white h-12 w-full flex items-center justify-between px-4 mb-4">
            <button 
              onClick={toggleFilterDrawer} 
              className="bg-white text-black flex items-center px-2 py-2 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512" 
                className="h-4 w-5 mr-1" 
              >
                <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/>
              </svg>
            </button>

            <div className="w-full max-w-sm min-w-[200px]">
              <div className="relative">
                <input
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Search Products" 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button
                  className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => handleFilterChange({ userName: null, color: [], price: null })} 
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                  </svg>
                  Search
                </button> 
              </div>
            </div>
          </div>

          <div className='text-3xl text-center text-black font-Poppins tracking-wide font-semibold mb-2'>My Products</div>
          <div className='flex items-center justify-center'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentProducts.length === 0 ? (
                <p className="text-center text-lg text-gray-700">No PRODUCTS AVAILABLE</p>
              ) : (
                currentProducts.map((product) => (
                  <Card
                    key={product.id || 'no id'}
                    userName={product.userName || 'no key available'}
                    imgSrc={product.prodimg || 'defaultImage'}
                    title={product.title || 'No title'}
                    color={product.color || 'No description'}
                    unit={product.unit || "unit"}
                    price={product.price || "no price available"}
                    productid={product.productid || "no price available"}
                  />
                  
                ))
              )}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <div className='border p-1 border-gray-700 bg-gray-200 rounded-lg mb-1'>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-2 p-2 rounded ${currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Home;
