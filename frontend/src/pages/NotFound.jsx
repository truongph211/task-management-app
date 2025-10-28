import React from 'react'

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-between min-h-screen text-center bg-slate-50'>
      <img src='error-404.png' alt='Not Found' className='max-w-full mb-6 w-96' />

    <p className='text-lg text-gray-700 mb-6'>Sorry, the page you are looking for does not exist.</p>
    <a href='/' className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'>Go Back Home</a>
    </div>
  )
}

export default NotFound