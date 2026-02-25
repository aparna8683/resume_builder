import React from "react";
import { Lock, Mail, User2Icon } from "lucide-react";
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

React.useEffect(() => {
  setState(urlState || "login");
}, [urlState]);
  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/api/users/${state}`, data);
      dispatch(login(response.data));
      localStorage.setItem("token", response.data.token);
      toast.success(response.data.message);
      navigate("/dashboard"); // redirect after login
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const toggleState = () => {
    const newState = state === "login" ? "register" : "login";
    setState(newState);
    navigate(`?state=${newState}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[380px] text-center border border-zinc-200 
        rounded-2xl px-8 py-10 bg-white shadow-xl"
      >
        <h1 className="text-zinc-900 text-3xl font-semibold">
          {state === "login" ? "Login" : "Register"}
        </h1>

        <p className="text-zinc-500 text-sm mt-2 mb-6">
          Please {state === "login" ? "sign in" : "sign up"} to continue
        </p>

        {state !== "login" && (
          <div
            className="flex items-center w-full mb-4 bg-zinc-50 
          border border-zinc-200 h-12 rounded-xl px-4 gap-3 
          focus-within:border-indigo-400 transition"
          >
            <User2Icon size={18} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              required
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        )}

        <div
          className="flex items-center w-full mb-4 bg-zinc-50 
        border border-zinc-200 h-12 rounded-xl px-4 gap-3 
        focus-within:border-indigo-400 transition"
        >
          <Mail size={18} className="text-zinc-400" />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            required
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        <div
          className="flex items-center w-full mb-4 bg-zinc-50 
        border border-zinc-200 h-12 rounded-xl px-4 gap-3 
        focus-within:border-indigo-400 transition"
        >
          <Lock size={18} className="text-zinc-400" />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            required
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {state === "login" && (
          <div className="text-right mb-4">
            <button
              type="button"
              className="text-sm text-indigo-500 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full h-12 rounded-xl text-white 
          bg-indigo-600 hover:bg-indigo-700 
          transition font-medium"
        >
          {state === "login" ? "Login" : "Create Account"}
        </button>

        <p className="text-zinc-500 text-sm mt-6">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            type="button"
            onClick={toggleState}
            className="ml-2 text-indigo-600 hover:underline"
          >
            {state === "login" ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
