import React, { useState, useEffect } from "react";
import { Lock, Mail, User2, Eye, EyeOff, Sparkles, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../configs/api";
import { login } from "../app/features/authslice";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlState = searchParams.get("state");
  const [state, setState] = useState(urlState === "register" ? "register" : "login");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [rememberEmail, setRememberEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlState === "register" || urlState === "login") setState(urlState);
  }, [urlState]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setData((prev) => ({ ...prev, email: savedEmail }));
      setRememberEmail(true);
    }
  }, []);

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email.trim() || !data.password) return toast.error("Email and password are required");
    if (state === "register" && !data.name.trim()) return toast.error("Please enter your full name");

    try {
      setLoading(true);
      const endpoint = state === "login" ? "/api/users/login" : "/api/users/register";
      const payload = state === "login"
        ? { email: data.email.trim(), password: data.password }
        : { name: data.name.trim(), email: data.email.trim(), password: data.password };
      const { data: response } = await api.post(endpoint, payload);

      if (!response?.token || !response?.user) throw new Error("The server returned an invalid authentication response.");
      localStorage.setItem("token", response.token);
      dispatch(login({ token: response.token, user: response.user }));

      if (rememberEmail) localStorage.setItem("rememberEmail", data.email.trim());
      else localStorage.removeItem("rememberEmail");

      toast.success(response.message || (state === "login" ? "Welcome back!" : "Account created!"));
      navigate("/app", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleState = (targetState) => {
    setState(targetState);
    setSearchParams(targetState === "register" ? { state: "register" } : {}, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-indigo-50/70 via-slate-50 to-white px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <ArrowLeft className="size-3.5" />Back to Home
          </Link>
        </div>
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/60">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-semibold mb-3"><Sparkles className="size-3.5" />AI Powered Resume Studio</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{state === "login" ? "Welcome Back" : "Get Started Free"}</h1>
            <p className="text-sm text-slate-500 mt-2">{state === "login" ? "Enter your credentials to access your resumes" : "Build an ATS-optimized professional resume in minutes"}</p>
          </div>
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button type="button" onClick={() => toggleState("login")} className={`py-2 text-xs font-semibold rounded-xl transition-all ${state === "login" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}>Sign In</button>
            <button type="button" onClick={() => toggleState("register")} className={`py-2 text-xs font-semibold rounded-xl transition-all ${state === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}>Create Account</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {state === "register" && <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label><div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl px-3.5 gap-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition"><User2 size={16} className="text-slate-400 shrink-0" /><input type="text" placeholder="e.g. Alex Smith" name="name" value={data.name} onChange={onChangeHandler} required className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm w-full text-slate-800 placeholder:text-slate-400" /></div></div>}
            <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label><div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl px-3.5 gap-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition"><Mail size={16} className="text-slate-400 shrink-0" /><input type="email" placeholder="alex@example.com" name="email" value={data.email} onChange={onChangeHandler} required autoComplete="email" className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm w-full text-slate-800 placeholder:text-slate-400" /></div></div>
            <div><label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label><div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl px-3.5 gap-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition"><Lock size={16} className="text-slate-400 shrink-0" /><input type={showPassword ? "text" : "password"} placeholder={state === "register" ? "At least 8 characters" : "••••••••"} name="password" value={data.password} onChange={onChangeHandler} required minLength={state === "register" ? 8 : undefined} autoComplete={state === "register" ? "new-password" : "current-password"} className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm w-full text-slate-800 placeholder:text-slate-400" /><button type="button" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? "Hide password" : "Show password"} className="text-slate-400 hover:text-slate-600 transition p-1">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
            {state === "login" && <div className="flex items-center justify-between pt-1"><label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer"><input type="checkbox" checked={rememberEmail} onChange={(e) => setRememberEmail(e.target.checked)} className="size-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />Remember email</label></div>}
            <button type="submit" disabled={loading} className="w-full h-11 mt-2 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer">{loading ? <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Processing...</span></> : <><span>{state === "login" ? "Sign In" : "Create Account"}</span><ArrowRight className="size-4" /></>}</button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-[11px] text-slate-500"><div className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" /><span>ATS Friendly Templates</span></div><div className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" /><span>AI Content Enhancer</span></div></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
