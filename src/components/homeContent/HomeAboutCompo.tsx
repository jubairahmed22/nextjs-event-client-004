import React from "react";
import { FilterSidebar } from "../AllProductCopmonent/FilterSidebar";
import { FilterCategorySidebar } from "../AllProductCopmonent/FilterCategorySidebar";
import Link from "next/link";

const HomeAboutCompo = () => {
  const services = [
    {
      id: 1,
      title: "PLANNING",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      description: "Meticulous event planning with precision timing and flawless execution for unforgettable experiences."
    },
    {
      id: 2,
      title: "DESIGN & STYLING",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      description: "Bespoke designs that transform visions into breathtaking realities with elegant styling."
    },
    {
      id: 3,
      title: "COORDINATION",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: "Seamless coordination of all elements to create harmonious and stress-free events."
    }
  ];

  return (
    <div className="relative overflow-hidden font-montserrat">
      {/* Background pattern */}
      {/* <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNBRjQ4NDgiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRjMC0xLjEuOS0yIDItMmgxNmMxLjEgMCAyIC45IDIgMnYxNmMwIDEuMS0uOSAyLTIgMkgzOGMtMS4xIDAtMi0uOS0yLTJWMzR6TTIgMzRjMC0xLjEuOS0yIDItMmgxNmMxLjEgMCAyIC45IDIgMnYxNmMwIDEuMS0uOSAyLTIgMkg0Yy0xLjEgMC0yLS45LTItMlYzNHpNMzYgMmMwLTEuMS45LTIgMi0yaDE2YzEuMSAwIDIgLjkgMiAydjE2YzAgMS4xLS45IDItMiAySDM4Yy0xLjEgMC0yLS45LTItMlYyek0yIDJjMC0xLjEuOS0yIDItMmgxNmMxLjEgMCAyIC45IDIgMnYxNmMwIDEuMS0uOSAyLTIgMkg0Yy0xLjEgMC0yLS45LTItMlYyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div> */}
      <div className="mx-auto max-w-screen-3xl px-4 py-16 relative z-10">
        <h1 className="mb-6 text-center text-lg md:text-2xl lg:text-4xl font-playfairDisplay font-bold text-white leading-tight">
          <span className="relative inline-block">
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-900">
              ABOUT / WHAT WE DO
            </span>
          </span>
        </h1>

        {/* Mission Paragraph */}
        <div className="max-w-screen-3xl lg:w-[60%] md:w-[90%] mx-auto mb-16 text-center">
          <p className="text-md md:text-md text-rose-800 font-light leading-relaxed">
            We craft extraordinary events that tell your unique story. With passion and precision, 
            we transform dreams into reality through innovative planning, exquisite design, 
            and flawless execution. Our mission is to create moments that linger in memory 
            long after the last guest departs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {services.map((service) => (
            <div key={service.id} className="group relative p-8 overflow-hidden rounded-xl bg-gradient-to-br from-rose-50/10 to-rose-100/5 backdrop-blur-sm border border-rose-200/20 hover:border-rose-300/40 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-300/10">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-300/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -left-5 -bottom-5 w-32 h-32 bg-rose-400/5 rounded-full group-hover:scale-125 transition-transform duration-700 delay-75"></div>
            </div>
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-400/10 via-transparent to-transparent"></div>
            
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-rose-300/30 transition-all duration-300 group-hover:border-rose-400/50"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-rose-300/30 transition-all duration-300 group-hover:border-rose-400/50"></div>
            
            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon max-w-screen-3xl with sophisticated design */}
              <div className="mb-6 p-5 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 shadow-lg group-hover:shadow-rose-300/30 transition-all duration-500">
                <div className="p-3 rounded-full bg-gradient-to-br from-rose-200 to-rose-100 text-rose-700 group-hover:text-rose-900 group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
              </div>
              
              {/* Title with decorative underline */}
              <h3 className="text-2xl font-bold font-playfairDisplay text-rose-900 mb-4 relative pb-2">
                {service.title}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent group-hover:w-24 group-hover:via-rose-600 transition-all duration-300"></span>
              </h3>
              
              {/* Description with smooth hover effect */}
              <p className="text-rose-800/90 font-light leading-relaxed transition-all duration-300 group-hover:text-rose-900 group-hover:translate-y-1">
                {service.description}
              </p>
              
              {/* Decorative flourish at bottom */}
              <div className="mt-6 w-8 h-0.5 bg-rose-300/50 group-hover:bg-rose-400/70 group-hover:w-12 transition-all duration-300"></div>
            </div>
          </div>
          ))}
        </div>
        <div className="flex justify-center items-center my-10">
        <Link href="book-consultation">
          <button className="px-8 py-3 bg-gradient-to-r from-rose-700 to-rose-900 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:shadow-rose-400/20 transition-all duration-300 hover:scale-105">
            Book a consultation
          </button>
        </Link>
         
        </div>
      </div>
    </div>
  );
};

export default HomeAboutCompo;