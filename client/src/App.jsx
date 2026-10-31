import React, { useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import api from "./configs/api";
import HOME from "./Pages/Home";
import Layout from "./Pages/Layout";
import Dashboard from "./Pages/Dashboard";
import ResumeBuilder from "./Pages/ResumeBuilder";
import Preview from "./Pages/Preview";
import Login from "./Pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, setLoading } from "./app/features/authslice";
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const getUserData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    try {
      const { data } = await api.get("/api/users/data");
      if (data?.user) {
        dispatch(login({ token, user: data.user }));
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.warn("Session check notice:", error?.response?.data?.message || error.message);
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1e1e2d",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
            padding: "12px 18px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HOME />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/app" replace /> : <Login />}
        />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>
        <Route path="/register" element={user ? <Navigate to="/app" replace /> : <Login />}/>
        <Route path="/view/:resumeId" element={<Preview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
