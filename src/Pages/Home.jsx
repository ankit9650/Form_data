import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../Components/Card';

function Home() {
  const [products, setProducts] = useState([]); 
  const [error, setError] = useState(null);
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

      console.log('Response data:', response.data);

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

  const handleBuy = () =>{

  }

  return (
    <>
      
      <div className='text-3xl  text-center text-black font-Poppins tracking-wide font-semibold mb-2'>My products</div>
     
      <div className='flex items-center justify-center'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {products.map((product) => (
            <Card 
              userName={product.userName || 'no key avai'}            
              imgSrc={product.prodimg || 'defaultImage.png'} 
              title={product.title}
              color={product.color || 'No description available'} 
            />
          ))}
        </div>
      </div>
      <ToastContainer />
     
    </>
  );
  
}

export default Home;
