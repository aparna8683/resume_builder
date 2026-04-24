import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const logos = [
    "https://cdn.simpleicons.org/react",
    "https://cdn.simpleicons.org/node.js",
    "https://cdn.simpleicons.org/mongodb",
    "https://cdn.simpleicons.org/javascript",
    "https://cdn.simpleicons.org/github",
  ];

  return (
    <>
      <div className="min-h-screen pb-20">
        {/* Navbar */}
        <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
          <Link to="/">
            <img src="/logo.svg" alt="Resume Builder Logo" className="h-11 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
            <a href="#" className="hover:text-indigo-600 transition">
              Home
            </a>
            <a href="#features" className="hover:text-indigo-600 transition">
              Features
            </a>
            <a href="#testimonials" className="hover:text-indigo-600 transition">
              Testimonials
            </a>
            <a href="#cta" className="hover:text-indigo-600 transition">
              Contact
            </a>
          </div>

          <div className="flex gap-2">
            {!user ? (
              <>
                <Link
                  to="/app?state=register"
                  className="hidden md:block px-6 py-2 bg-indigo-500 hover:bg-indigo-700 active:scale-95 transition-all rounded-full text-white"
                >
                  Get started
                </Link>

                <Link
                  to="/app?state=login"
                  className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900"
                >
                  Login
                </Link>
              </>
            ) : (
              <Link
                to="/app"
                className="hidden md:block px-8 py-2 bg-indigo-500 hover:bg-indigo-700 active:scale-95 transition-all rounded-full text-white"
              >
                Dashboard
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden active:scale-90 transition"
            aria-label="Open Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 5h16M4 12h16M4 19h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <a onClick={() => setMenuOpen(false)} href="#" className="text-white">
            Home
          </a>
          <a onClick={() => setMenuOpen(false)} href="#features" className="text-white">
            Features
          </a>
          <a onClick={() => setMenuOpen(false)} href="#testimonials" className="text-white">
            Testimonials
          </a>
          <a onClick={() => setMenuOpen(false)} href="#cta" className="text-white">
            Contact
          </a>

          {!user ? (
            <>
              <Link
                to="/app?state=register"
                className="px-7 py-2 bg-indigo-600 text-white rounded-full"
              >
                Get started
              </Link>
              <Link
                to="/app?state=login"
                className="px-7 py-2 border border-white text-white rounded-full"
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              to="/app"
              className="px-7 py-2 bg-indigo-600 text-white rounded-full"
            >
              Dashboard
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(false)}
            className="aspect-square size-10 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md flex items-center justify-center"
          >
            X
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black">
          <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-indigo-300 blur-[100px] opacity-30"></div>

          {/* Avatars + Stars */}
          <div className="flex items-center mt-24">
            <div className="flex -space-x-3 pr-3">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                alt="user"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]"
              />
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="user"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[2]"
              />
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                alt="user"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]"
              />
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt="user"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]"
              />
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="user"
                className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[5]"
              />
            </div>

            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-indigo-600"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                    </svg>
                  ))}
              </div>
              <p className="text-sm text-gray-700">Built for students and developers</p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]">
            Land Your Dream Job with{" "}
            <span className="bg-gradient-to-r from-indigo-700 to-indigo-600 bg-clip-text text-transparent text-nowrap">
              AI-powered
            </span>{" "}
            Resumes.
          </h1>

          <p className="max-w-md text-center text-base my-7 text-slate-600">
            Create, edit and download professional resumes with AI-powered assistance.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/app"
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-indigo-400 flex items-center transition-colors"
            >
              Get started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="ml-1 size-4"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>

            <button className="flex items-center gap-2 border border-slate-400 hover:bg-indigo-50 transition rounded-full px-7 h-12 text-slate-700">
              <span>Try demo</span>
            </button>
          </div>

          {/* Tagline */}
          <p className="py-6 text-slate-600 mt-14 text-center">
            From campus to career — build your resume right
          </p>

          {/* Logos */}
          <div
            className="flex flex-wrap justify-center gap-8 max-w-2xl w-full mx-auto py-4"
            id="logo-container"
          >
            {logos.map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="tech logo"
                className="h-8 object-contain opacity-60 hover:opacity-100 transition duration-300 grayscale hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');

          * {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>
    </>
  );
};

export default Hero;