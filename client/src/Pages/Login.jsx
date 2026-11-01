import React, { useEffect, useState } from "react";
import { Lock, Mail, User2, Eye, EyeOff, Sparkles, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../configs/api";
import { login, logout } from "../app/features/authslice";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlState = searchParams.get("state");
  const resetToken = searchParams.get("token") || "";
  const [state, setState] = useState(
    ["login", "register", "forgot", "reset"].includes(urlState) ? urlState : "login"
  );
  const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [developmentResetUrl, setDevelopmentResetUrl] = useState("");

  useEffect(() => {
    if (["login", "register", "forgot", "reset"].includes(urlState)) setState(urlState);
  }, [urlState]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) setData((prev) => ({ ...prev, email: savedEmail }));
  }, []);

  const onChangeHandler = (event) => {
    setData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (state !== "reset" && !data.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (["login", "register", "reset"].includes(state) && !data.password) {
      toast.error("Password is required");
      return;
    }
    if (state === "register" && !data.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (state === "reset") {
      if (!resetToken) {
        toast.error("This reset link is missing its token. Request a new link.");
        return;
      }
      if (data.password.length < 8 || data.password.length > 128) {
        toast.error("Password must be between 8 and 128 characters");
        return;
      }
      if (data.password !== data.confirmPassword) {
        toast.error("The passwords do not match");
        return;
      }
    }

    try {
      setLoading(true);

      if (state === "forgot") {
        const response = await api.post("/api/users/forgot-password", { email: data.email.trim() });
        setResetMessage(response.data.message || "If an account exists, reset instructions have been sent.");
        setDevelopmentResetUrl(response.data.developmentResetUrl || "");
        return;
      }

      if (state === "reset") {
        const response = await api.post("/api/users/reset-password", {
          token: resetToken,
          password: data.password,
        });
        toast.success(response.data.message || "Password reset successfully");
        dispatch(logout());
        setData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        navigate("/login?state=login", { replace: true });
        return;
      }

      const endpoint = state === "login" ? "/api/users/login" : "/api/users/register";
      const payload = state === "login"
        ? { email: data.email.trim(), password: data.password, rememberMe }
        : { name: data.name.trim(), email: data.email.trim(), password: data.password };
      const response = await api.post(endpoint, payload);

      // A successful credential response is not enough: protected routes rely
      // on the HttpOnly cookie. Confirm that the browser stored and sent it
      // before showing success or navigating into the authenticated app.
      let sessionResponse;
      try {
        sessionResponse = await api.get("/api/users/data");
      } catch (error) {
        if (error?.response?.status === 401) {
          throw new Error("Sign-in succeeded, but the browser did not send the session cookie. Restart the API and use the same hostname for the app and API.");
        }
        throw error;
      }
      const authenticatedUser = sessionResponse.data?.user;
      if (!authenticatedUser) {
        throw new Error("The session cookie was not accepted. Restart the API and sign in again using the same hostname for the app and API.");
      }

      // The server stores the session in an HttpOnly cookie. Never persist passwords
      // or the session token in browser storage.
      localStorage.removeItem("token");
      if (state === "login" && rememberMe) {
        localStorage.setItem("rememberEmail", data.email.trim());
      } else if (state === "login") {
        localStorage.removeItem("rememberEmail");
      }
      dispatch(login({ user: authenticatedUser || response.data.user }));
      toast.success(response.data.message || (state === "login" ? "Welcome back!" : "Account created!"));
      navigate("/app");
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Authentication failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleState = (targetState) => {
    setState(targetState);
    setResetMessage("");
    setDevelopmentResetUrl("");
    navigate(`/login?state=${targetState}`, { replace: true });
  };

  const isResetFlow = state === "forgot" || state === "reset";
  const title = state === "login" ? "Welcome Back"
    : state === "register" ? "Get Started Free"
      : state === "forgot" ? "Forgot Password?" : "Choose a New Password";
  const subtitle = state === "login" ? "Enter your credentials to access your resumes"
    : state === "register" ? "Build an ATS-optimized professional resume in minutes"
      : state === "forgot" ? "Enter your account email and we’ll send a secure reset link"
        : "Your new password must be between 8 and 128 characters";

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-indigo-50/70 via-slate-50 to-white px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link to="/" aria-label="Resumify.ai home" className="shrink-0 rounded-xl transition-transform hover:scale-[1.02]">
            <img src="/logo.svg" alt="Resumify.ai - AI Resume Suite" className="h-10 w-auto" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/60">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-semibold mb-3">
              <Sparkles className="size-3.5" /> AI Powered Resume Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
          </div>

          {!isResetFlow ? (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
              <button type="button" onClick={() => toggleState("login")} className={`py-2 text-xs font-semibold rounded-xl transition-all ${state === "login" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}>
                Sign In
              </button>
              <button type="button" onClick={() => toggleState("register")} className={`py-2 text-xs font-semibold rounded-xl transition-all ${state === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}>
                Create Account
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => toggleState("login")} className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              <ArrowLeft className="size-3.5" /> Back to sign in
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {state === "register" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl px-3.5 gap-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition">
                  <User2 size={16} className="text-slate-400 shrink-0" />
                  <input type="text" autoComplete="name" placeholder="e.g. Alex Smith" name="name" value={data.name} onChange={onChangeHandler} required className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm w-full text-slate-800 placeholder:text-slate-400" />
                </div>
              </div>
            )}

            {state !== "reset" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl px-3.5 gap-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <input type="email" autoComplete="email" placeholder="alex@example.com" name="email" value={data.email} onChange={onChangeHandler} required className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm w-full text-slate-800 placeholder:text-slate-400" />
                </div>
              </div>
            )}

            {state !== "forgot" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{state === "reset" ? "New Password" : "Password"}</label>
                <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl px-3.5 gap-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition">
                  <Lock size={16} className="text-slate-400 shrink-0" />
                  <input type={showPassword ? "text" : "password"} autoComplete={state === "register" ? "new-password" : state === "reset" ? "new-password" : "current-password"} placeholder={state === "register" || state === "reset" ? "At least 8 characters" : "Enter your password"} name="password" value={data.password} onChange={onChangeHandler} minLength={state === "register" || state === "reset" ? 8 : undefined} maxLength={128} required className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm w-full text-slate-800 placeholder:text-slate-400" />
                  <button type="button" onClick={() => setShowPassword((previous) => !previous)} className="text-slate-400 hover:text-slate-600 transition p-1" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {state === "reset" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                <div className="flex items-center w-full bg-slate-50 border border-slate-200 h-11 rounded-xl px-3.5 gap-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition">
                  <Lock size={16} className="text-slate-400 shrink-0" />
                  <input type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Re-enter your password" name="confirmPassword" value={data.confirmPassword} onChange={onChangeHandler} minLength={8} maxLength={128} required className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm w-full text-slate-800 placeholder:text-slate-400" />
                </div>
              </div>
            )}

            {state === "login" && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="size-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                  Remember me on this device
                </label>
                <button type="button" onClick={() => toggleState("forgot")} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot password?</button>
              </div>
            )}

            {state === "forgot" && resetMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                <p>{resetMessage}</p>
                {developmentResetUrl && <a className="mt-2 inline-block break-all font-semibold underline" href={developmentResetUrl}>Open development reset link</a>}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full h-11 mt-2 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] disabled:opacity-60 disabled:cursor-wait shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer">
              {loading ? <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Processing...</span></> : <><span>{state === "login" ? "Sign In" : state === "register" ? "Create Account" : state === "forgot" ? "Send Reset Link" : "Reset Password"}</span><ArrowRight className="size-4" /></>}
            </button>
          </form>

          {!isResetFlow && (
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" /><span>ATS Friendly Templates</span></div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" /><span>AI Content Enhancer</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
