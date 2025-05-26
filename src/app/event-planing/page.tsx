"use client"; // Add this at the top if using Next.js App Router

import { motion } from "framer-motion"; // Changed to named import
import Link from "next/link";

const ServicesPage = () => {
  // Planning Service Packages

  const planningServices = [
    {
      name: "Diamond Package",
      description:
        "The complete planning & Coordination package is for the couple that wants every detail of their wedding managed by a professional from the begining to the end. The Diamond package includes",
      points: [
        "Consultation with the bride and groom.",
        "Theme and/or color scheme creation & implementation.",
        "Budget Planning.",
        "Assistance with attire and accessory selection for attendants.",
        "Assistance with ceremony and reception site selection, including tours.",
        "Assistance with save-the-date card and/or invitation mailing and tracking.",
        "Menu selection or creation.",
        "Guest's meal choice tracking.",
        "Program creation for the ceremony.",
        "Reception layout and seating chart arrangements.",
        "Unlimited vendor referrals and contract reviews.",
        "Unlimited interview and/or final vendor meetings.",
        "Transportation coordination.",
        "Assistance with paperwork (marriage license, name change documents).",
        "Salon/spa coordination for hair and makeup.",
        "Hotel accommodations for out-of-town guests and the couple on the wedding night.",
        "Meeting with the couple one month prior to the wedding.",
        "Confirmation of delivery locations, times, and final arrangements with all vendors.",
        "Coordination of the ceremony rehearsal.",
        "Final collection of wedding items at rehearsal to be set up on wedding day such as candles, photographs, guest book, wedding favors, toasting glasses, serving sets, programs, seating cards, table numbers, etc.",
        "Customized wedding day itinerary to be distributed to all vendors.",
        "Itemized to-do list with regular check-ins and follow-ups.",
        "Main point of contact for all vendors and service providers.",
        "Distribution of final vendor payments and gratuities.",
        "Supervision and assistance with ceremony and reception setup and decoration.",
        "Coordination of ceremony processional, recessional, and receiving line.",
        "Meet, greet and direct vendors and guests on the wedding day.",
        "Collection and transportation of ceremony decor and accessories to reception.",
        "Unlimited phone, email and text message correspondence.",
        "Up to two in-person/on-location meetings.",
        "Etiquette advisement.",
        "10 Hour Wedding Day Service.",
        "Wedding day emergency kit.",
      ],
    },
    {
      name: "Ruby Package",
      description:
        "The Partial Planning & Coordination is for the couple that has planned most of their wedding  but requires professional assistance for  final planning and finalization of the details for the wedding.The RUBY package include",
      points: [
        "Consultation with the bride and groom.",
        "Meeting with the couple one month prior to the wedding.",
        "Confirmation of delivery locations, times, and final arrangements with all vendors.",
        "Coordination of the ceremony rehearsal.",
        "Final collection of wedding items at rehearsal to be set up on wedding day such as candles, photographs, guest book, wedding favors, toasting glasses, serving sets, programs, seating cards, table numbers, etc.",
        "Customized wedding day itinerary to be distributed to all vendors.",
        "Itemized to-do list with regular check-ins and follow-ups.",
        "Main point of contact for all vendors and service providers.",
        "Distribution of final vendor payments and gratuities.",
        "Supervision and assistance with ceremony and reception setup and decoration.",
        "Coordination of ceremony processional, recessional, and receiving line.",
        "Meet, greet and direct vendors and guests on the wedding day.",
        "Collection and transportation of ceremony decor and accessories to reception.",
        "Unlimited phone, email and text message correspondence.",
        "Up to two in-person/on-location meetings.",
        "10 Hour Wedding Day Service.",
        "Wedding day emergency kit.",
      ],
    },
    {
      name: "Amber Package",
      description:
        "The Day of/ month of coordination is the perfect package for couples who prefer to plan their own wedding but needs the help of a professional for the final details and the wedding day. The AMBER package include",
      points: [
        "Consultation with the bride and groom.",
        "Vendor & Venue Referrals.",
        "Creation & Maintenance of Personalized Wedding Website.",
        "Design of stationery.",
        "Addressing & Sending Out Invitations.",
        "Event Design Consultations.",
        "Wedding Ceremony and Reception Floor Plans & Seating Charts.",
        "Floral/Table Décor Consultations.",
        "Candy Buffet and Dessert Table.",
        "Rehearsal Dinner Coordination.",
        "RSVP and Guest List Management.",
        "Meeting with the couple one month prior to the wedding.",
        "Confirmation of delivery locations, times, and final arrangements with all vendors.",
        "Coordination of the ceremony rehearsal.",
        "Final collection of wedding items at rehearsal to be set up on wedding day such as candles, photographs, guest book, wedding favors, toasting glasses, serving sets, programs, seating cards, table numbers, etc.",
        "Customized wedding day itinerary to be distributed to all vendors.",
        "Itemized to-do list with regular check-ins and follow-ups.",
        "Main point of contact for all vendors and service providers.",
        "Distribution of final vendor payments and gratuities.",
        "Supervision and assistance with ceremony and reception setup and decoration.",
        "Coordination of ceremony processional, recessional, and receiving line.",
        "Meet, greet and direct vendors and guests on the wedding day.",
        "Collection and transportation of ceremony decor and accessories to reception.",
        "Unlimited phone, email and text message correspondence.",
        "Up to two in-person/on-location meetings.",
        "10 Hour Wedding Day Service.",
        "Wedding day emergency kit.",
        "Engagement parties.",
        "Bridal showers.",
        "Bachelor parties.",
        "Anniversary.",
        "Baby Shower.",
        "Mehndi/Holoud/Henna Night.",
        "Graduation Party.",
      ],
    },
  ];

  // Private Party Services
  const privateParties = [
    {
      name: "Hena/Mehendi",
      description: "Full Planning, Cordinating & Designing.",
    },
    {
      name: "Corporate Event Planning & Decor Designing",
      description: "We do all Corporate Event planning & Decor Desiging.",
    },
    {
      name: "Private Events",
      description:
        "We Also Provide for Private Event Planning, Coordinating & Decor Designing.",
    },
  ];

  // Corporate Events
  const corporateEvents = [
    {
      name: "Conferences",
      description:
        "Professional planning for business conferences and seminars.",
    },
    {
      name: "Corporate Parties",
      description:
        "Memorable company parties that impress your team and clients.",
    },
    {
      name: "Employee Fun Days",
      description:
        "Team-building activities and fun outings for your workforce.",
    },
  ];

  const text = "Event Planning";
  const letters = text.split("");
  return (
    <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:my-20 my-5">
      <Link href="/book-consultation">
        <button
  className="fixed text-rose-800 border hover:text-white border-rose-100 font-playfairDisplay text-sm sm:text-md font-semibold right-4 top-44 lg:top-64 -translate-y-1/2 
            bg-transparent hover:bg-opacity-100 hover:bg-black
            hover:border-rose-100
            py-1 sm:py-2 px-2 sm:px-4 rounded-full shadow-lg
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] 
            w-24 h-24 sm:w-36 sm:h-36 transform hover:scale-105 active:scale-95
            backdrop-blur-sm z-20
            flex items-center justify-center
            group overflow-hidden
            before:absolute before:inset-0 before:bg-white/5 before:opacity-0 
            before:transition-opacity before:duration-500 hover:before:opacity-100
            after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/10 after:to-white/5 
            after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100"
>
  {/* Animated circle element - responsive */}
  <span
    className="absolute w-full h-full rounded-full border border-white/10 sm:border-2
            group-hover:border-white/30 group-hover:scale-110 
            transition-all duration-700 ease-out"
  ></span>

  {/* Text with responsive sizing and animation - hidden on mobile */}
  <span
    className="relative z-10 hidden sm:block
            transition-transform duration-300 group-hover:translate-y-[-2px]
            group-active:translate-y-0"
  >
    Book a consultation
  </span>

  {/* Mobile-only icon (plus sign) */}
  <span className="relative z-10 block sm:hidden text-sm font-bold">Book a Consultation</span>

  {/* Glow effect on hover */}
  <span
    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
  ></span>
</button>
      </Link>
      <motion.div className="text-start lg:mb-16 mb-8">
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

      {/* Planning Services Section */}
      <section className="mb-12">
        <h1 className="lg:my-20 my-5 text-center text-lg md:text-2xl lg:text-4xl font-playfairDisplay font-bold text-white leading-tight">
          <span className="relative inline-block">
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-900">
              Planning Services
            </span>
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planningServices.map((service, index) => (
            <div
              key={service._id}
              className="group relative p-8 overflow-hidden rounded-xl bg-gradient-to-br from-rose-50/10 to-rose-100/5 backdrop-blur-sm border border-rose-200/20 hover:border-rose-300/40 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-300/10"
            >
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
                {/* <div className="mb-6 p-5 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 shadow-lg group-hover:shadow-rose-300/30 transition-all duration-500">
                <div className="p-3 rounded-full bg-gradient-to-br from-rose-200 to-rose-100 text-rose-700 group-hover:text-rose-900 group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
              </div> */}

                {/* Title with decorative underline */}
                <h3 className="text-2xl font-bold font-playfairDisplay text-rose-900 mb-4 relative pb-2">
                  {service.name}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-rose-400 to-transparent group-hover:w-24 group-hover:via-rose-600 transition-all duration-300"></span>
                </h3>

                {/* Description with smooth hover effect */}
                <p className="text-rose-800/90 text-start font-light leading-relaxed transition-all duration-300 group-hover:text-rose-900 group-hover:translate-y-1">
                  {service.description}
                </p>

                <ul className="w-full text-left text-rose-800/90 space-y-2 mb-4 mt-5">
                  {service.points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start"
                    >
                      <span className="text-rose-500 mr-2">•</span>
                      <span className="font-light">{point}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Decorative flourish at bottom */}
                <div className="mt-6 w-8 h-0.5 bg-rose-300/50 group-hover:bg-rose-400/70 group-hover:w-12 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Private Parties Section */}
      <section className="mb-12">
        <h1 className="my-20 text-center text-lg md:text-2xl lg:text-4xl font-playfairDisplay font-bold text-white leading-tight">
          <span className="relative inline-block">
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-900">
              Private Parties
            </span>
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {privateParties.map((service, index) => (
            <div
              key={service._id}
              className="group relative p-8 overflow-hidden rounded-xl bg-gradient-to-br from-rose-50/10 to-rose-100/5 backdrop-blur-sm border border-rose-200/20 hover:border-rose-300/40 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-300/10"
            >
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
                {/* <div className="mb-6 p-5 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 shadow-lg group-hover:shadow-rose-300/30 transition-all duration-500">
                <div className="p-3 rounded-full bg-gradient-to-br from-rose-200 to-rose-100 text-rose-700 group-hover:text-rose-900 group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
              </div> */}

                {/* Title with decorative underline */}
                <h3 className="text-2xl font-bold font-playfairDisplay text-rose-900 mb-4 relative pb-2">
                  {service.name}
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
      </section>

      {/* Corporate Events Section */}
      <section className="mb-12">
        <h1 className="my-20 text-center text-lg md:text-2xl lg:text-4xl font-playfairDisplay font-bold text-white leading-tight">
          <span className="relative inline-block">
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-900">
              Corporate Events
            </span>
          </span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {corporateEvents.map((service, index) => (
            <div
              key={service._id}
              className="group relative p-8 overflow-hidden rounded-xl bg-gradient-to-br from-rose-50/10 to-rose-100/5 backdrop-blur-sm border border-rose-200/20 hover:border-rose-300/40 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-300/10"
            >
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
                {/* <div className="mb-6 p-5 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 shadow-lg group-hover:shadow-rose-300/30 transition-all duration-500">
                <div className="p-3 rounded-full bg-gradient-to-br from-rose-200 to-rose-100 text-rose-700 group-hover:text-rose-900 group-hover:scale-110 transition-all duration-300">
                  {service.icon}
                </div>
              </div> */}

                {/* Title with decorative underline */}
                <h3 className="text-2xl font-bold font-playfairDisplay text-rose-900 mb-4 relative pb-2">
                  {service.name}
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
      </section>
    </div>
  );
};

export default ServicesPage;
