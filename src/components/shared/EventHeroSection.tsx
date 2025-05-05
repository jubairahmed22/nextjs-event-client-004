"use client";

import Link from "next/link";

const EventHeroSection = () => {
  return (
    <div className="relative">
      {/* Background Video */}
      <section className="relative bg-white dark:bg-gray-900 h-[60vh] min-h-[600px] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://firebasestorage.googleapis.com/v0/b/political-portfolio.appspot.com/o/7213953_Event_Wedding_1920x1080.mp4?alt=media&token=a5b4ca1e-03e4-4f62-a753-7ec7dc450fc1"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Content */}
        <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-playfairDisplay font-bold text-white leading-tight">
              <span className="block mb-4">Crafting Extraordinary</span>
              <span className="relative inline-block">
                <span className="absolute -inset-2 bg-white/20 blur-lg rounded-lg"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
                  Experiences
                </span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-playfairDisplay font-medium text-white/90 mb-8 max-w-screen-3xl mx-auto">
              Bring your vision to life with flawless event planning and
              unforgettable experiences.
            </p>

            {/* Enhanced Glass Effect Button with Animation */}
            <Link href="/all-products">
            <div className="relative inline-block group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-400/30 to-amber-300/30 blur-md group-hover:blur-lg transition-all duration-500 animate-pulse-slow"></div>
              <button className="relative px-10 py-4 font-marcellus bg-white/10 backdrop-blur-md border-2 border-white/20 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:shadow-rose-400/30 transition-all duration-300 hover:bg-white/20 group-hover:scale-[1.03]">
                <span className="relative z-10 text-xl">Explore Products</span>
                <span className="absolute inset-0 rounded-full overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </span>
              </button>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-2 bg-amber-100/10 blur-md group-hover:blur-lg group-hover:w-full transition-all duration-500"></div>
            </div>
            </Link>

            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-amber-400/10 blur-xl animate-float"></div>
          </div>
        </div>
      </section>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 0.1;
          }
          50% {
            transform: translate(-50%, -20px) scale(1.1);
            opacity: 0.15;
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EventHeroSection;