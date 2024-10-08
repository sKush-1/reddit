import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Provider } from "urql";
import { client } from "./utils/createUrqlClient";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import { Toaster } from "react-hot-toast";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/change-password/:token",
    element: <ChangePassword/>
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword/>
  },
  {
    path: "/create-post",
    element: <CreatePost/>
  }
]);

function App() {
  return (
    <Provider value={client}> {/* Provide the Urql client to the app */}
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
      <Toaster/>
    </Provider>
  );
}

export default App;
