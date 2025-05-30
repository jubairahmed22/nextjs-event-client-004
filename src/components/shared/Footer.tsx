import React from "react";

import love from "../../assets/love.jpeg"; // Import the image
import aed from "../../assets/aed.jpeg"; // Import the image
import iwed from "../../assets/iwed.jpeg"; // Import the image
import lwpi from "../../assets/lwpi.jpeg"; // Import the image
import rated from "../../assets/rated.jpeg"; // Import the image
import theKnot from "../../assets/theKnot.jpeg"; // Import the image
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-3xl font-pacifico hover:text-rose-500 transition-all duration-300"
              aria-label="Home"
            >
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                MY COLOR EVENTS
              </span>
            </Link>
            <div className="space-y-2">
              <p className="font-montserrat text-white">
                Based in CT. We Serve CT, NY, NJ, MA & RI
              </p>
              <p className="font-montserrat">Business: 203-548-7769</p>
              <p className="font-montserrat">Cell Phone: 203-559-9680, 203-559-2621</p>
              <p className="font-montserrat hover:text-white transition-colors">
                <a href="mailto:info@mycolorevents.com">
                  Email: info@mycolorevents.com
                </a>
              </p>
            </div>
          </div>

         

          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="text-xl font-montserrat font-semibold text-white">
              Certified by
            </h3>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-center p-1 bg-white rounded-lg">
                <img
                  alt=""
                  className="h-16  object-contain"
                  src={love.src}
                />
              </div>
              <div className="flex items-center justify-center p-1 bg-white rounded-lg">
                <img
                  alt=""
                  className="h-16  object-contain"
                  src={aed.src}
                />
              </div>
              <div className="flex items-center justify-center p-1 bg-white rounded-lg">
                <img
                  alt=""
                  className="h-16  object-contain"
                  src={iwed.src}
                />
              </div>
              <div className="flex items-center justify-center p-1 bg-white rounded-lg">
                <img
                  alt=""
                  className="h-16  object-contain"
                  src={lwpi.src}
                />
              </div>
            </div>
            
          </div>
           {/* Quick Links - Example Section */}
          <div className="flex flex-row lg:justify-center sm:justify-center">
            <div className="space-y-4">
            <h3 className="text-xl font-montserrat font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 font-montserrat grid grid-cols-2 ">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="hover:text-white transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/Decor-Rental"
                  className="hover:text-white transition-colors"
                >
                  Décor Rental
                </a>
              </li>
              <li>
                <a
                  href="/book-consultation"
                  className="hover:text-white transition-colors"
                >
                  Book a Consultation
                </a>
              </li>
            </ul>
            <div className="flex flex-row justify-start gap-5">
               <a href="https://pros.weddingpro.com/" target="_blank">
              <img
                  alt=""
                  className="h-10 mt-4 w-32 rounded-md bg-white px-2 object-contain"
                  src="https://www.wipa.org/wp-content/uploads/2022/03/WeddingPro_Logo_Large-color.png"
                />
            </a>
             <div className="flex gap-2">
              <a href="https://www.weddingwire.com/biz/my-color-events-design-llc/b47d59fedc0e2af1.html" target="_blank">
              <img
                  alt=""
                  className="h-16 mt-4  rounded-md  px-2 object-contain"
                  src={rated.src}
                />
            </a>
            <a href="https://www.weddingwire.com/biz/my-color-events-design-llc/b47d59fedc0e2af1.html" target="_blank">
              <img
                  alt=""
                  className="h-16 mt-4  rounded-md  px-2 object-contain"
                  src={theKnot.src}
                />
            </a>
             </div>
            </div>
          </div>
         
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center gap-5 md:flex-row">
            <p className="text-sm font-raleway">
              © {new Date().getFullYear()} My Color Events. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="mt-4 flex space-x-6 md:mt-0">
              <a
                href="https://www.facebook.com/MyColorEvent/?ref=bookmarks"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/mycolorevents/"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@mycolorcolorevents274"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
