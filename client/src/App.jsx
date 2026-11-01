import React, { useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const authPageState = new URLSearchParams(location.search).get("state");

  const getUserData = useCallback(async () => {
    try {
      const { data } = await api.get("/api/users/data");
      if (data?.user) {
        // Migrate any old localStorage session to the HttpOnly cookie session.
        localStorage.removeItem("token");
        dispatch(login({ user: data.user }));
      } else {
        dispatch(logout());
      }
    } catch (error) {
      // A 401 during startup simply means there is no saved session to restore.
      if (error?.response?.status !== 401) {
        console.warn("Session check failed:", error?.response?.data?.message || error.message);
      }
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  useEffect(() => {
    const handleUnauthorized = () => dispatch(logout());
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [dispatch]);

  // Finish restoring the cookie session before displaying routes. This prevents
  // a late startup 401 from racing with a user submitting the login form.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" role="status" aria-label="Checking your session">
        <div className="size-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

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
          element={user && !["forgot", "reset"].includes(authPageState) ? <Navigate to="/app" replace /> : <Login />}
        />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>
        <Route path="/view/:resumeId" element={<Preview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
