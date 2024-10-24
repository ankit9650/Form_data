import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../Components/Card';

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const navigate = useNavigate();

  const userData = async () => {
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
        setProducts(response.data);
      } else {
        setProducts([]);
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
    userData();
  }, []);


  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);


  const totalPages = Math.ceil(products.length / itemsPerPage);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>


    
      <div className='text-3xl text-center text-black font-Poppins tracking-wide font-semibold mb-2'>My products</div>

      <div className='flex items-center justify-center'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {currentProducts.map((product) => (
            <Card
              key={product.id || 'no id'}
              userName={product.userName || 'no key avai'}
              imgSrc={product.prodimg || 'defaultImage'}
              title={product.title}
              color={product.color || 'No description'}
              unit={product.unit || "unit"}
            />
          ))}
        </div>
      </div>


      <div className="flex justify-center mt-4">
        <div className='border p-1 border-gray-700 bg-gray-200 rounded-lg mb-1  '>
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

      <ToastContainer />
    </>
  );
}

export default Home;
