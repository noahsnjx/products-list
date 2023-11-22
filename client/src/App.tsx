import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Products from "./pages/Products";
import Login from "./pages/Login";
import "./css/App.css";
import { useAccessToken } from "./store/auth";

const AppLayout = () => {
  return (
    <div className="App" style={{ overflow: "hidden" }}>
      <Outlet></Outlet>
    </div>
  );
};

const ProtectedRoutes = () => {
  const accessToken = useAccessToken();
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "login",
        element: <Login />
      },
      {
        path: "*",
        element: <ProtectedRoutes />,
        children: [
          {
            path: "products-list",
            element: <Products />
          }
        ]
      }
    ]
  }
]);

const App = () => <RouterProvider router={router}></RouterProvider>;

export default App;
