"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import EventPageLoading from "@/components/Loading/EventPageLoading";

interface Event {
  EventTitle: string;
  EventValue: string;
  singleImage: string;
}

const HomeEvent: React.FC = () => {
  const [eventData, setEventData] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loader state

  useEffect(() => {
    const fetcheventData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get<Event[]>(
          "http://localhost:8000/eventCollection"
        );
        setEventData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    // Fetch data immediately and then set interval
    fetcheventData();
  }, []);

  return (
    <div className="pb-10 max-w-screen-2xl mx-auto">
      <div className="py-10 mx-auto w-full max-w-screen-2xl p-4 ">
        <h1 className="font-bold tracking-wider text-4xl text-center font-playfairDisplay  text-rose-900">
          Events
        </h1>
        <p className="font-semibold tracking-wider text-lg mt-5 text-center font-playfairDisplay  text-rose-900">
          Let us bring your vision to life, ensuring every event is seamless,
          memorable, and uniquely yours.
        </p>
        <div
          className="h-1 w-full mt-5"
          style={{
            background:
              "linear-gradient(to right, transparent, #6B021A, transparent)",
          }}
        ></div>
      </div>

      {loading ? (
        <EventPageLoading></EventPageLoading>
      ) : (
        <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-5">
        {eventData.map((event) => (
          <div key={event.EventValue} className="relative h-[400px] rounded-xl">
            {/* Video Background */}

            <img
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
              src={event.singleImage}
              alt=""
            ></img>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-40 rounded-xl"></div>

            {/* Content */}
            <section className="relative z-10 h-full">
              <div className="flex justify-center flex-col gap-6 items-center h-full">
              <h1 className="tracking-wider lg:text-3xl text-center font-playfairDisplay text-white font-extrabold leading-none md:text-5xl  dark:text-white [text-shadow:_0_0_8px_rgba(255,255,255,0.6),_0_0_16px_rgba(255,255,255,0.4)]">
                  {event.EventTitle}
                </h1>

                <Link
                  className="px-6 py-2 bg-white text-xl font-playfairDisplay"
                  href={`/events/${event.EventValue}`}
                >
                  Learn More
                </Link>
              </div>
            </section>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default HomeEvent;
