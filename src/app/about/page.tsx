"use client";
import TeamMember from "@/components/shared/TeamMember";
import yousufmia from "../../assets/yousuf-mamu.jpeg"; // Import the image
import khadija from "../../assets/asdfa.webp"; // Import the image
import { motion } from "framer-motion";

const Page = () => {

  const text = "About Us";
  const letters = text.split("");

  return (
    <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
      <motion.div className="text-start  mb-16">
            <h1 className="mb-4 text-lg md:text-2xl lg:text-6xl uppercase font-montserrat font-bold">
              <span className="relative inline-block">
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.05,
                    }}
                    className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-rose-900"
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </span>
            </h1>
      </motion.div>
      <div className="max-w-screen-2xl mx-auto font-montserrat">
  {/* Hero Section */}
  <section className="py-16 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-rose-50 to-white">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-rose-800 mb-6">
        Our Creative Visionaries
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Meet the passionate team behind My Color Events LLC, turning dreams into unforgettable experiences.
      </p>
    </div>
  </section>

  {/* Yousuf Section */}
  <section className="py-20 px-4 md:px-8 lg:px-12">
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 w-full order-2 lg:order-1">
          <div className="space-y-8">
            <div>
              <span className="text-rose-600 font-semibold tracking-wider">FOUNDER & CREATIVE DIRECTOR</span>
              <h2 className="text-4xl md:text-5xl font-bold text-rose-800 mt-4">
                Turning Vision into Reality
              </h2>
              <p className="text-gray-600 text-lg mt-4">
                Yousuf is the lead planner and designer who brings innovative concepts to life with precision and creativity.
              </p>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-rose-700">Yousuf Mia</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                  <p className="text-gray-700 font-medium">Certified Wedding & Event Planner (CWEP™)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                  <p className="text-gray-700 font-medium">Accredited Event Designer (AED™)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                  <p className="text-gray-700 font-medium">15+ Years of Industry Experience</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <div className="lg:w-1/2 w-full order-1 lg:order-2">
          <div className="relative group">
            <div className="absolute -inset-2 bg-rose-200 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
              <img
                className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-500"
                src={yousufmia.src}
                alt="Yousuf Mia - Founder & Creative Director"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Khadiza Section */}
  <section className="py-20 px-4 md:px-8 lg:px-12 bg-gray-50">
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="lg:w-1/2 w-full">
          <div className="relative group">
            <div className="absolute -inset-2 bg-rose-200 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
              <img
                className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-500"
                src={khadija.src}
                alt="Khadiza Akhtar - CEO & Founder"
              />
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/2 w-full">
          <div className="space-y-8">
            <div>
              <span className="text-rose-600 font-semibold tracking-wider">CEO & FOUNDER</span>
              <h2 className="text-4xl md:text-5xl font-bold text-rose-800 mt-4">
                Excellence in Event Leadership
              </h2>
              <p className="text-gray-600 text-lg mt-4">
                Khadiza brings strategic vision and operational excellence to create seamless, memorable events.
              </p>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-rose-700">Khadiza Akhtar (Mila)</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                  <p className="text-gray-700 font-medium">Certified Wedding & Event Planner (CWEP™)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                  <p className="text-gray-700 font-medium">10+ Years of Luxury Event Experience</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-600"></div>
                  <p className="text-gray-700 font-medium">Operations & Client Relations Specialist</p>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Team Section */}
  <section className="py-20 px-4 md:px-8 lg:px-12 bg-white">
    <div className="max-w-screen-xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-rose-800 mb-4">
          Our Dream Team
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Talented professionals dedicated to making your event extraordinary
        </p>
      </div>
      <TeamMember />
    </div>
  </section>


</div>
    </div>
  );
};

export default Page;
