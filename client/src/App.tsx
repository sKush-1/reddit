import theme from './theme'
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './Pages/Register';
const router = createBrowserRouter([
  {
    path: "/",
    // element: <HomePage />
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/login",
    // element: <Login />
  }
]);




function App() {
 return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
   </ChakraProvider>
 )
}


export default App