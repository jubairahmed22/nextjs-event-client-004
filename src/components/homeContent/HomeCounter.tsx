import React, { useState, useEffect, useRef } from 'react';

const HomeCounter = () => {
    const [counters, setCounters] = useState([
        { id: 1, name: 'Events', target: 119, current: 0, suffix: '+' },
        { id: 2, name: 'Wedding', target: 75, current: 0, suffix: '+' },
        { id: 3, name: 'Real Estate', target: 25, current: 0, suffix: '+' }
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
                setCounters(prevCounters => {
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
        <div ref={counterRef} className="mx-auto max-w-screen-4xl px-4 pt-10 relative z-10 font-montserrat w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
  {counters.map((counter) => (
    <div 
      key={counter.id} 
      className="group p-8 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      {/* Animated number with gradient text */}
      <h3 className="text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {Math.round(counter.current)}{counter.suffix}
      </h3>
      
      {/* Label with decorative underline */}
      <div className="relative inline-block">
        <p className="text-xl font-semibold text-gray-800">
          {counter.name}
        </p>
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-300"></span>
      </div>
      
      {/* Optional decorative element */}
      <div className="mt-4">
        <div className="w-16 h-1 mx-auto bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full"></div>
      </div>
    </div>
  ))}
</div>
        </div>
    );
};

export default HomeCounter;