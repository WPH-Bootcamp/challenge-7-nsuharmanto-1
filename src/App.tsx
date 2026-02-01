import { Routes, Route, useNavigate, useLocation, matchPath } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage.tsx';
import AddressPage from './pages/AddressPage.tsx';
import OrdersPage from './pages/OrdersPage';
import DetailPage from './pages/DetailPage.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import CartPage from './pages/CartPage';
import { Toaster } from "@/components/ui/toaster";
import { useRestaurantsQuery } from './services/queries/restaurant';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "./services/api/axios";
import { login, logout } from "./features/user/userSlice";
import type { RootState } from "./features/store";


function App() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.user);
  const { data: restaurants = [] } = useRestaurantsQuery(isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const publicPaths = [
    "/",
    "/login",
    "/register",
  ];
  const isPublic =
    publicPaths.includes(location.pathname) ||
    matchPath("/restaurant/:id", location.pathname) ||
    matchPath("/category/:categoryId", location.pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr && !user) {
      try {
        const userObj = JSON.parse(userStr);
        dispatch(login(userObj));
      } catch {
        dispatch(logout());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    if (isPublic) return;

    if (token) {
      axios
        .get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.data) {
            dispatch(login(res.data.data));
            // Simpan user ke localStorage agar bisa direstore
            localStorage.setItem("user", JSON.stringify(res.data.data));
          } else {
            dispatch(logout());
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }
        })
        .catch(() => {
          dispatch(logout());
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        });
    } else {
      dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [dispatch, navigate, location.pathname, isPublic, user]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        dispatch(logout());
        navigate("/");
      }
      if (e.key === "user" && !e.newValue) {
        dispatch(logout());
        navigate("/");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [dispatch, navigate]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/address"
          element={
            <ProtectedRoute>
              <AddressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/restaurant/:id" element={<DetailPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage restaurants={restaurants} />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
}

export default App;