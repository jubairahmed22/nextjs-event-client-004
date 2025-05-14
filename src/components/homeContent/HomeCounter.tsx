import React, { useState, useEffect, useRef } from "react";

const HomeCounter = () => {
  const [counters, setCounters] = useState([
    { id: 1, name: "Weddings", target: 219, current: 0, suffix: "+" },
    { id: 2, name: "Private Parties", target: 175, current: 0, suffix: "+" },
    { id: 3, name: "Corporate Events", target: 125, current: 0, suffix: "+" },
  ]);

  const counterRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters();
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 } // Trigger when 50% of component is visible
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000; // Animation duration in ms
    const interval = 10; // Update interval in ms
    const steps = duration / interval;

    counters.forEach((counter, index) => {
      const increment = counter.target / steps;
      const timer = setInterval(() => {
        setCounters((prevCounters) => {
          const newCounters = [...prevCounters];
          if (newCounters[index].current < counter.target) {
            newCounters[index].current = Math.min(
              counter.target,
              newCounters[index].current + increment
            );
          } else {
            clearInterval(timer);
          }
          return newCounters;
        });
      }, interval);
    });
  };

  return (
    <div
      ref={counterRef}
      className="mx-auto max-w-screen-3xl px-4 pt-10 relative z-10 font-montserrat w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {counters.map((counter) => (
          <div
            key={counter.id}
            className="group relative p-8 rounded-xl overflow-hidden border border-gray-100 shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Gradient overlay background */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 to-red-50/30 group-hover:from-rose-100/40 group-hover:to-red-100/40 transition-all duration-500"></div>

            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTkiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00em0tMjQgMGMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTR6TTAgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00em0wLTI0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNHoNMTIgMTBjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00em0yNCAwYzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Animated number with gradient text */}
              <h3 className="text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                {Math.round(counter.current)}
                {counter.suffix}
              </h3>

              {/* Label with decorative underline */}
              <div className="relative inline-block">
                <p className="text-xl font-semibold text-gray-800">
                  {counter.name}
                </p>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-rose-300 to-red-300 group-hover:from-rose-500 group-hover:to-red-500 transition-all duration-300"></span>
              </div>

              {/* Optional decorative element */}
              <div className="mt-4">
                <div className="w-16 h-1 mx-auto bg-gradient-to-r from-rose-200 to-red-200 rounded-full group-hover:w-20 transition-all duration-300"></div>
              </div>
            </div>

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 -mr-6 -mt-6 rounded-full bg-red-100/50 group-hover:bg-red-200/50 transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCounter;
