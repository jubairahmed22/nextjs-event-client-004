import yousufmia from "../../assets/yousuf-mamu.jpeg"; // Import the image

const page = () => {
  return (
    <div className="max-w-screen-2xl mx-auto font-playfairDisplay">
      <section className="py-24 relative xl:mr-0 lg:mr-5 mr-0 max-w-screen-2xl ">
        <div className=" max-w-screen-2xl px-4 md:px-5 lg:px-5 mx-auto">
          <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
            <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
              <div className="w-full flex-col justify-center items-start gap-8 flex">
                <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                  <h6 className="text-rose-900 text-2xl  font-normal leading-relaxed">
                    About Us
                  </h6>
                  <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                    <h2 className="text-rose-700 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                    Turning a Vision into Reality
                    </h2>
                    <p className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
                       Yousuf is Lead Planner & Designer of My Color Events LLC.
                    </p>
                  </div>
                </div>
                <div className="w-full flex-col justify-center items-start gap-6 flex">
                <h2 className="text-rose-700 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                  Yousuf 
                </h2>
                <p className="text-gray-500 text-xl font-semibold leading-relaxed lg:text-start text-center">
                Founder & Creative Director
                Certified Wedding & Event Planner  (CWEP™)
                </p>
                <p className="text-gray-500 text-xl font-semibold leading-relaxed lg:text-start text-center">
                Accredited Event Designer  (AED™)
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
      {/* <section class="py-20 relative max-w-screen-2xl">
        <div class="w-full max-w-screen-2xl px-4 md:px-5 lg:px-5 mx-auto">
            <div class="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
            <img class="lg:mx-0 mx-auto h-full rounded-3xl object-cover" src="https://pagedone.io/asset/uploads/1717751272.png" alt="about Us image" />

                <div class="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
                    <div class="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
                        <h2 class="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">Building Stronger Communities through Collaboration and Empowerment</h2>
                        <p class="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">Through collaborationperse perspectives and strengths are leveraged to create inclusive environments where everyone has the opportunity to thrive. This approach not only fosters personal growth and achievement but also strengthens the fabric of society.</p>
                    </div>
                    <button class="sm:w-fit w-full px-3.5 py-2 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex">
                        <span class="px-1.5 text-white text-sm font-medium leading-6">Get Started</span>
                    </button>
                </div>
                

            </div>
        </div>
      </section> */}
                                            
    </div>
  );
};

export default page;
