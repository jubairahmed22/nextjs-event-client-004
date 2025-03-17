import React from "react";

import love from "../../assets/love.jpeg"; // Import the image
import aed from "../../assets/aed.jpeg"; // Import the image
import iwed from "../../assets/iwed.jpeg"; // Import the image
import lwpi from "../../assets/lwpi.jpeg"; // Import the image


const Footer = () => {
  return (
   

<footer className="bg-rose-900 dark:bg-gray-900">
    <div className="mx-auto w-full max-w-screen-2xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
              <a href="https://flowbite.com/" className="flex items-center">                  {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="FlowBite Logo" /> */}
                  <span className="self-center text-4xl font-pacifico font-semibold  whitespace-nowrap text-white">My Color Events</span>
              </a>
              <div className="flex flex-col gap-2 mt-5">
              <h1 className="text-md font-semibold font-playfairDisplay text-white">Based in CT. We Serve CT, NY, NJ, MA & RI</h1>
              <h1 className="text-md font-semibold font-playfairDisplay text-white">Business : 203-548-7769</h1>
              <h1 className="text-md font-semibold font-playfairDisplay text-white">Mobile : 203-559-9680</h1>
              <h1 className="text-md font-semibold font-playfairDisplay text-white">Email : info@mycolorevents.com</h1>
              </div>
          </div>
          <div >
          <div className="flex justify-start items-center pb-6">
                 <h1 className="text-4xl font-playfairDisplay font-semibold text-white">Certified by</h1>
              </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2  place-items-end sm:grid-cols-2 gap-5 font-poppins text-white">
              
              <img alt="" className="w-28 h-28 object-cover" src={love.src}></img>
              <img alt="" className="w-28 h-28 object-cover" src={aed.src}></img>
              <img alt="" className="w-28 h-28 object-cover" src={iwed.src}></img>
              <img alt="" className="w-28 h-28 object-cover" src={lwpi.src}></img>
          </div>
          </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center font-raleway dark:text-gray-400">Copyright © 2025  My Color Events  All rights reserved.</span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
              <a href="#" className="text-white hover:text-white dark:hover:text-white">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                        <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
                    </svg>
                  <span className="sr-only">Facebook page</span>
              </a>
        
              <a href="#" className="text-white hover:text-white dark:hover:text-white ms-5">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                    <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd"/>
                </svg>
                  <span className="sr-only">Twitter page</span>
              </a>
 
          </div>
      </div>
    </div>
</footer>

  );
};

export default Footer;
