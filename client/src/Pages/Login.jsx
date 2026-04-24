import React from "react";
import { Lock, Mail, User2Icon, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../configs/api";
import { login } from "../app/features/authslice";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlState = searchParams.get("state");
  const [state, setState] = React.useState(urlState || "login");

  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const [rememberEmail, setRememberEmail] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setState(urlState || "login");
  }, [urlState]);

  React.useEffect(() => {
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

    if (!data.email.trim() || !data.password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    if (state === "register" && !data.name.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      setLoading(true);

      const payload =
        state === "login"
          ? {
              email: data.email.trim(),
              password: data.password,
            }
          : {
              name: data.name.trim(),
              email: data.email.trim(),
              password: data.password,
            };

      const response = await api.post(`/api/users/${state}`, payload);

      dispatch(login(response.data));

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (rememberEmail) {
        localStorage.setItem("rememberEmail", data.email.trim());
      } else {
        localStorage.removeItem("rememberEmail");
      }

      toast.success(response.data.message || "Success");
      navigate("/app");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleState = () => {
    const newState = state === "login" ? "register" : "login";
    setState(newState);
    navigate(`?state=${newState}`);

    setData((prev) => ({
      ...prev,
      name: "",
      password: "",
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[400px] bg-white/90 backdrop-blur border border-indigo-100 rounded-3xl px-8 py-10 shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-zinc-900 text-3xl font-bold">
            {state === "login" ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="text-zinc-500 text-sm mt-2 mb-8">
            {state === "login"
              ? "Login to continue building your resume"
              : "Start building your professional resume"}
          </p>
        </div>

        {state === "register" && (
          <div className="flex items-center w-full mb-4 bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 gap-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
            <User2Icon size={18} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              required
              className="bg-transparent outline-none border-none focus:outline-none focus:ring-0 text-sm w-full"
            />
          </div>
        )}

        <div className="flex items-center w-full mb-4 bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 gap-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
          <Mail size={18} className="text-zinc-400" />
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            required
            className="bg-transparent outline-none border-none outline-none focus:outline-none focus:ring-0  text-sm w-full"
          />
        </div>

        <div className="flex items-center w-full mb-4 bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 gap-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
          <Lock size={18} className="text-zinc-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            required
            className="bg-transparent outline-none border-none outline-none focus:outline-none focus:ring-0  text-sm w-full"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-zinc-400 hover:text-indigo-600 transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {state === "login" && (
          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="accent-indigo-600"
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition font-medium shadow-lg shadow-indigo-200"
        >
          {loading
            ? "Please wait..."
            : state === "login"
            ? "Login"
            : "Create Account"}
        </button>

        <p className="text-zinc-500 text-sm mt-6 text-center">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={toggleState}
            className="ml-2 text-indigo-600 font-medium hover:underline"
          >
            {state === "login" ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;