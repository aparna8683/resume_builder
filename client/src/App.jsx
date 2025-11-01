import React from "react";
import { Routes, Route } from "react-router-dom";
import HOME from "./Pages/HOME.JSX";
import Layout from "./Pages/Layout";
import Dashboard from "./Pages/Dashboard";
import ResumeBuilder from "./Pages/ResumeBuilder";
import Preview from "./Pages/Preview";
import Login from "./Pages/Login";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HOME />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />
        <Route path="login" element={<Login />} />
        <Route />
      </Routes>
    </>
  );
};

export default App;
