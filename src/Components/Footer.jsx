import React from 'react'

function Footer() {
    return (
        <footer className="footer relative  bottom-0 text-center bg-gray-200 text-base-content p-4">
        <aside>
          <p className='font-bold'>Copyright © {new Date().getFullYear()} - All right reserved by Ankit</p>
        </aside>
      </footer>
    )
}

export default Footer;