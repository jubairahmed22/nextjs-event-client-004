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
            <h1 className="mb-4 text-lg md:text-2xl lg:text-6xl uppercase font-playfairDisplay font-bold">
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
      <div className="max-w-screen-2xl mx-auto font-playfairDisplay">
        <section className=" relative xl:mr-0 lg:mr-5 mr-0 max-w-screen-2xl ">
          <div className=" max-w-screen-2xl px-4 md:px-5 lg:px-5 mx-auto">
            <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
              <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                <div className="w-full flex-col justify-center items-start gap-8 flex">
                  <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                    {/* <h6 className="text-rose-900 text-2xl  font-normal leading-relaxed">
                    About Us
                  </h6> */}
                    <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                      <h2 className="text-rose-700 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                        Turning a Vision into Reality
                      </h2>
                      <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                        Yousuf is Lead Planner & Designer of My Color Events
                        LLC.
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex-col justify-center items-start gap-6 flex">
                    <h2 className="text-rose-700 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                      Yousuf
                    </h2>
                    <p className="text-gray-500 text-xl font-semibold leading-relaxed lg:text-start text-center">
                      Founder & Creative Director Certified Wedding & Event
                      Planner (CWEP™)
                    </p>
                    <p className="text-gray-500 text-xl font-semibold leading-relaxed lg:text-start text-center">
                      Accredited Event Designer (AED™)
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:justify-end justify-center items-start flex ">
                <div className="sm:w-[564px] w-full sm:h-[646px] h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 relative">
                  <img
                    className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                    src={yousufmia.src}
                    alt="about Us image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className=" relative xl:mr-0 lg:mr-5 mr-0 max-w-screen-2xl ">
          <div className=" max-w-screen-2xl px-4 md:px-5 lg:px-5 mx-auto">
            <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
              <div className="w-full lg:justify-start justify-center items-start flex ">
                <div className="sm:w-[564px] w-full sm:h-[646px] h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 relative">
                  <img
                    className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                    src={khadija.src}
                    alt="about Us image"
                  />
                </div>
              </div>

              <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                <div className="w-full flex-col justify-center items-start gap-8 flex">
                  <div className="flex-col justify-start lg:items-start items-center gap-4 flex"></div>
                  <div className="w-full flex-col justify-center items-start gap-6 flex">
                    <h2 className="text-rose-700 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                      Khadiza Akhtar (Mila)
                    </h2>
                    <p className="text-gray-500 text-xl font-semibold leading-relaxed lg:text-start text-center">
                      CEO, Founder & Creative Director Certified Wedding & Event
                      Planner (CWEP™)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10">
          <TeamMember></TeamMember>
        </div>
      </div>
    </div>
  );
};

export default Page;
