import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import Login from "./Login";
import { Navigate } from "react-router-dom";

const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="size-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-100/50 mb-4 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Loading your workspace...</p>
        <p className="text-xs text-slate-400 mt-1">Preparing your resumes & AI tools</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {user ? (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      ) : (
        <Navigate to="/login" replace />
      )}
    </div>
  );
};

export default Layout;
