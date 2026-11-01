import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-indigo-100/80 bg-gradient-to-br from-white via-indigo-50/60 to-violet-50/60">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12 lg:py-16">
      <div className="space-y-4">
        <Link to="/" aria-label="Resumify.ai home" className="inline-flex rounded-xl transition-transform hover:scale-[1.02]">
          <img src="/logo.svg" alt="Resumify.ai - AI Resume Suite" className="h-11 w-auto" />
        </Link>
        <p className="max-w-sm text-sm leading-6 text-slate-600">
          Build a confident, ATS-friendly resume with smart tools that keep your experience at the center.
        </p>
        <Link to="/login?state=register" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700">
          <Sparkles className="size-4" /> Create your resume <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900">Explore</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li><a href="/#features" className="transition hover:text-indigo-600">Features</a></li>
          <li><a href="/#testimonials" className="transition hover:text-indigo-600">Testimonials</a></li>
          <li><a href="/#cta" className="transition hover:text-indigo-600">Get started</a></li>
        </ul>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-900">Your workspace</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li><Link to="/login?state=login" className="transition hover:text-indigo-600">Sign in</Link></li>
          <li><Link to="/login?state=register" className="transition hover:text-indigo-600">Create an account</Link></li>
          <li><Link to="/app" className="transition hover:text-indigo-600">Dashboard</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-indigo-100/80 px-6 py-5 text-center text-xs text-slate-500">
      Copyright {new Date().getFullYear()} Resumify.ai. All rights reserved.
    </div>
  </footer>
);

export default Footer;
