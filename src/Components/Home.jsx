import React from 'react'

function Home(props) {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
    <h1>Hey i am Home component {JSON.stringify(props.bulk)}</h1>
  </div>
  )
}

export default Home