import React from "react";

const EventHeroSection = () => {
  return (
    <div>
     <section className="relative bg-white dark:bg-gray-900 lg:h-[600px] md:h-[500px] sm:h-[400px]">
  {/* Background Image */}
  <img 
    className="absolute inset-0 w-full h-full object-cover"
    src="https://i.ibb.co.com/DD0B90NR/ceremony-arch-wedding-arch-wedding-wedding-moment-decorations-decor-wedding-decorations.jpg" 
    alt="Background"
  />
  
  {/* Overlay to ensure text readability */}
  <div className="absolute inset-0 bg-black opacity-50"></div>

  {/* Content */}
  <div className="relative  max-w-screen-2xl px-4 py-8 mx-auto lg:gap-2 xl:gap-0 lg:py-16">
    <div className="mr-auto place-self-center ">
    <h1 className="max-w-4xl mb-4 tracking-wider text-4xl font-playfairDisplay text-white font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white [text-shadow:_0_0_8px_rgba(255,255,255,0.6),_0_0_16px_rgba(255,255,255,0.4)]">
  Crafting Extraordinary Experiences, One Event at a Time
</h1>
      <p className="max-w-2xl text-white font-playfairDisplay font-semibold mb-6  lg:mb-8 md:text-lg lg:text-2xl dark:text-gray-400">
      Bring your vision to life with flawless event planning and unforgettable experiences.
      </p>
     
    </div>
  </div>
</section>
    </div>
  );
};

export default EventHeroSection;
