import React from "react";
import Title from "./Title";
import { BookUserIcon, Zap, Star } from "lucide-react";

const Testimonials = () => {
  const cardsData = [
    {
      name: "Aarav Sharma",
      role: "Frontend Intern",
      text: "I created a clean resume in minutes and used the AI suggestions to improve my project descriptions.",
    },
    {
      name: "Priya Mehta",
      role: "Software Developer",
      text: "The templates are simple, professional, and perfect for internship and placement applications.",
    },
    {
      name: "Rohan Verma",
      role: "MERN Stack Learner",
      text: "The public preview link made sharing my resume with recruiters super easy.",
    },
    {
      name: "Ananya Singh",
      role: "AI/ML Student",
      text: "It helped me highlight my skills, projects, and achievements in a much better way.",
    },
  ];

  const CreateCard = ({ card }) => (
    <div className="p-5 rounded-2xl mx-4 border border-zinc-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 w-80 shrink-0">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
          {card.name.charAt(0)}
        </div>

        <div>
          <p className="font-semibold text-zinc-800">{card.name}</p>
          <span className="text-xs text-zinc-500">{card.role}</span>
        </div>
      </div>

      <div className="flex gap-1 mt-4 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={15} fill="currentColor" />
        ))}
      </div>

      <p className="text-sm py-4 text-zinc-600 leading-relaxed">
        “{card.text}”
      </p>
    </div>
  );

  return (
    <>
      <div
        id="testimonials"
        className="flex flex-col items-center my-16 scroll-mt-12 px-4"
      >
        <div className="flex items-center gap-2 rounded-full px-6 py-1.5 bg-indigo-100 text-sm text-indigo-600">
          <Zap width={14} />
          <BookUserIcon className="size-4" />
          <span className="font-medium">Testimonials</span>
        </div>

        <Title
          title="Loved by resume builders"
          description="Students and developers use our AI-powered resume builder to create professional resumes, improve content, and share their work confidently."
        />

        <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />

          <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
            {[...cardsData, ...cardsData].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>

          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>

        <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />

          <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-6 pb-5">
            {[...cardsData, ...cardsData].map((card, index) => (
              <CreateCard key={index} card={card} />
            ))}
          </div>

          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 25s linear infinite;
        }

        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </>
  );
};

export default Testimonials;
