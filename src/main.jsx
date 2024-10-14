import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'


// const router = createBrowserRouter([
//   {
//     path:"/",
//     element:<Layout/>,
//     children:[
//       {
//         path:"/form",
//         element:<FormComponent/>
//       },
//       {
//         path:"/data",
//         element:<Data/>    
//       }
//     ]
//   },
// ])



createRoot(document.getElementById('root')).render(

  <StrictMode>
   <App/>
  </StrictMode>,
)