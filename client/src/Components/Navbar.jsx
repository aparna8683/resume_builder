import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../app/features/authslice";
import api from "../configs/api";
import { LogOut, FileText, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout");
    } catch (error) {
      console.warn("Could not clear the server session:", error?.message);
    } finally {
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Brand */}
        <Link to="/" className="shrink-0 rounded-xl transition-transform hover:scale-[1.02]" aria-label="Resumify.ai home">
          <img src="/logo.svg" alt="Resumify.ai — AI Resume Suite" className="h-10 sm:h-11 w-auto" />
        </Link>

        {/* Center / Navigation items */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
          <Link
            to="/app"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-white shadow-2xs transition-all"
          >
            <FileText className="size-3.5 text-indigo-500" />
            Dashboard
          </Link>
          <a
            href="/#features"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
          >
            <Sparkles className="size-3.5 text-amber-500" />
            Features
          </a>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2.5 pl-2 py-1 pr-1 bg-slate-50 border border-slate-200/80 rounded-full">
              <div className="size-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                {userInitial}
              </div>
              <span className="text-xs font-semibold text-slate-800 pr-2 max-sm:hidden">
                {user.name}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer active:scale-95"
            title="Log out"
          >
            <LogOut className="size-3.5" />
            <span className="max-sm:hidden">Logout</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
