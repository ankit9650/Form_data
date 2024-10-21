import React from 'react';

function Card({ imgSrc, title, color, userName}) {
  return (
    <>        
    <div className="max-w-sm bg-white rounded-lg overflow-hidden font-Poppins shadow-md shadow-black p-1">
      <img className="w-full h-72 rounded shadow" src={`http://localhost:5000${imgSrc}`} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-1">{title}</div>
        <div className="font-semibold text-md mb-2">Added By: {userName}</div>
        <p className="text-gray-700 text-base">
          {color}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2 font-sans space-x-2">
        <button type="submit" className="border border-gray-700 p-1.5 rounded-md hover:bg-blue-600 hover:text-white font-semibold">
          Buy Now
        </button>
        <button type="submit" className="border border-gray-700 p-1.5 rounded-md hover:bg-gray-600 hover:text-white font-semibold">
          Add to Cart
        </button>
        
        <button type="submit" className="border border-gray-700 p-1.5 rounded-md hover:bg-red-600 hover:text-white font-semibold">
          Delete
        </button>
        <button type="submit" className="border border-gray-700 p-1.5 rounded-md hover:bg-green-600 hover:text-white font-semibold">
          Edit
        </button>
      
      </div>
    </div>
    </>

  );
}

export default Card;
