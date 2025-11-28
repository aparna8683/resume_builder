import React, { useState } from "react";
import { Lock, Mail, User2Icon } from "lucide-react";

const Login = () => {
  const [state, setState] = useState("Register");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
  };

  // ✅ Fixed: Use curly braces instead of square brackets
  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[350px] text-center border border-zinc-300/60 dark:border-zinc-700 rounded-2xl px-8 bg-white dark:bg-zinc-900 shadow-lg"
      >
        {/* Title */}
        <h1 className="mt-10 font-medium text-zinc-900 dark:text-white text-3xl">
          {state === "Register" ? "Register" : "Login"}
        </h1>
        <p className="text-sm text-zinc-500 mb-4">
          Please {state === "Register" ? "register" : "login"} to enjoy our
          app’s services
        </p>

        {/* Name field only for Register */}
        {state !== "login" && (
          <div className="flex items-center w-full mt-4 bg-white border border-zinc-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={19} color="#6b7280" />
            <input
              type="text"
              placeholder="Name"
              className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-400 outline-none text-sm w-full"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
            />
          </div>
        )}

        {/* Email */}
        <div className="flex items-center mt-4 border border-zinc-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={19} color="#6b7280" />
          <input
            type="email"
            placeholder="Email"
            className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-400 outline-none text-sm w-full"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
          />
        </div>

        {/* Password */}
        <div className="flex items-center mt-4 border border-zinc-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={19} color="#6b7280" />
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-400 outline-none text-sm w-full"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
          />
        </div>

        {/* Forgot Password & Submit */}
        <div className="flex justify-between items-center mt-5">
          <a
            className="text-sm text-indigo-500 hover:opacity-90 transition-opacity"
            href="#"
          >
            Forgot Password?
          </a>
          <button
            type="submit"
            className="bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition"
          >
            {state === "Register" ? "Register" : "Login"}
          </button>
        </div>

        {/* Toggle Between Login / Register */}
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
          {state === "Register"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() =>
              setState((prev) => (prev === "login" ? "Register" : "login"))
            }
            className="text-indigo-500 hover:underline"
          >
            {state === "Register" ? "Login" : "Register"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
