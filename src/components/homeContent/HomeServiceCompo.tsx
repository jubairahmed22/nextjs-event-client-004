import Link from "next/link";
import React from "react";

const HomeServiceCompo = () => {
  const featuredServices = [
    {
      id: 1,
      title: "WEDDING PLANNING",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: "Full-service wedding coordination from concept to execution, ensuring your special day is flawless and uniquely yours.",
      features: [
        "Venue selection & logistics",
        "Timeline management",
        "Vendor coordination",
        "Day-of coordination"
      ]
    },
    {
      id: 2,
      title: "EVENT STYLING",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      description: "Transform any space into a breathtaking setting with our signature styling services that reflect your personal aesthetic.",
      features: [
        "Theme development",
        "Tablescapes & centerpieces",
        "Lighting design",
        "Custom installations"
      ]
    },
    {
      id: 3,
      title: "DECOR RENTALS",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22V12m0 0l8-4m-8 4L4 8" />
        </svg>
      ),
      description: "Premium rental collection featuring elegant furniture, linens, and decor items to elevate your event.",
      features: [
        "Curated inventory",
        "Delivery & setup",
        "Luxury furniture",
        "Specialty linens"
      ]
    },
    {
      id: 4,
      title: "CUSTOM PACKAGES",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      description: "Tailored solutions designed specifically for your vision, budget, and unique requirements.",
      features: [
        "Personalized consultations",
        "Flexible pricing",
        "A la carte options",
        "Complete customization"
      ]
    }
  ];

  return (
    <div className="relative overflow-hidden font-montserrat bg-gradient-to-b from-rose-50/10 to-rose-100/5">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-rose-400/10 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-rose-600/10 blur-xl"></div>
      </div>
      
      <div className="mx-auto max-w-screen-4xl px-4 py-20 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1 className="mb-4 text-lg md:text-2xl lg:text-4xl font-playfairDisplay font-bold text-rose-900">
            <span className="relative inline-block">
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-rose-900">
                OUR SERVICES
              </span>
            </span>
          </h1>
          {/* <div className="w-24 h-1 bg-gradient-to-r from-rose-300 to-rose-500 mx-auto mb-6"></div> */}
          <p className="max-w-2xl mx-auto text-md text-rose-800/90 font-light leading-relaxed">
            We offer comprehensive event solutions tailored to make your occasion unforgettable. 
            From intimate gatherings to grand celebrations, our services are designed to 
            bring your vision to life with elegance and precision.
          </p>
        </div>

        {/* Featured Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredServices.map((service) => (
            <div 
              key={service.id} 
              className="group relative h-full bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden border border-rose-200/30 hover:border-rose-300/50 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-rose-200/20"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-rose-50 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Decorative corner accents */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-rose-200/30 rounded-tr-xl transition-all duration-300 group-hover:border-rose-400/50"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-rose-200/30 rounded-bl-xl transition-all duration-300 group-hover:border-rose-400/50"></div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col p-8">
                {/* Icon */}
                <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 shadow-inner group-hover:shadow-rose-200/30 transition-all duration-300 inline-flex self-center">
                  <div className="p-3 rounded-full bg-gradient-to-br from-rose-200 to-rose-100 text-rose-700 group-hover:text-rose-900 group-hover:scale-105 transition-all duration-300">
                    {service.icon}
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold font-playfairDisplay text-rose-900 mb-3 text-center">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-rose-800/90 font-light mb-5 text-center flex-grow">
                  {service.description}
                </p>
                
                {/* Features list */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-rose-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-rose-700/90 font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Decorative bottom element */}
                <div className="mt-auto pt-4">
                  <div className="w-16 h-0.5 bg-rose-300/50 group-hover:bg-rose-400/70 group-hover:w-24 transition-all duration-300 mx-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-playfairDisplay text-rose-900 mb-4">
            Ready to create something extraordinary?
          </h3>
          <p className="text-rose-800/90 max-w-2xl mx-auto mb-8">
            Lets discuss how we can bring your vision to life with our bespoke event services.
          </p>
          <Link href="/wishListForm">
          <button className="px-8 py-3 bg-gradient-to-r from-rose-700 to-rose-900 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:shadow-rose-400/20 transition-all duration-300 hover:scale-105">
            Get in Touch
          </button>
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default HomeServiceCompo;