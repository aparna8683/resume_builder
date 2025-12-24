import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import api from "./configs/api";
import HOME from "./Pages/Home";
import Layout from "./Pages/Layout";
import Dashboard from "./Pages/Dashboard";
import ResumeBuilder from "./Pages/ResumeBuilder";
import Preview from "./Pages/Preview";
import Login from "./Pages/Login";
import { useDispatch } from "react-redux";
import { login, setLoading } from "./app/features/authslice";
import { Toaster } from "react-hot-toast";
const App = () => {
  const dispatch = useDispatch();
  const getUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', {
          headers: { Authorization: token },
        });
        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.message);
    }
  };
  useEffect(() => {
    getUserData(), [];
  });
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<HOME />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />

        <Route />
      </Routes>
    </>
  );
};

export default App;
