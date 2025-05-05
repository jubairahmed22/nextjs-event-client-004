"use client";
import { useState } from "react";
import Head from "next/head";
import background from "../../assets/expo-3.jpg"; // Import the image
import Image from 'next/image';

export default function ExpoPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [expoId, setExpoId] = useState("");
  const [projectSelectDate, setProjectSelectedDate] = useState<string>("");
  const [projectSelectedHour, setProjectSelectedHour] = useState<string>("12");
  const [projectSelectedMinute, setProjectSelectedMinute] =
    useState<string>("00");
  const [projectSelectedPeriod, setProjectSelectedPeriod] =
    useState<string>("AM");
  const [projectSelectEndDate, setProjectSelectedEndDate] =
    useState<string>("");
  const [projectSelectedEndHour, setProjectSelectedEndHour] =
    useState<string>("12");
  const [projectSelectedEndMinute, setProjectSelectedEndMinute] =
    useState<string>("00");
  const [projectSelectedEndPeriod, setProjectSelectedEndPeriod] =
    useState<string>("AM");
  const [data, setData] = useState<{ taxValue: number } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const [startYear, startMonth, startDay] = projectSelectDate.split("-");
    let startHour = parseInt(projectSelectedHour, 10);
    const startMinute = parseInt(projectSelectedMinute, 10);

    if (projectSelectedPeriod === "PM" && startHour < 12) startHour += 12;
    if (projectSelectedPeriod === "AM" && startHour === 12) startHour = 0;

    const combinedStartDate = new Date(
      Date.UTC(
        parseInt(startYear),
        parseInt(startMonth) - 1,
        parseInt(startDay),
        startHour,
        startMinute
      )
    );

    const [endYear, endMonth, endDay] = projectSelectEndDate.split("-");
    let endHour = parseInt(projectSelectedEndHour, 10);
    const endMinute = parseInt(projectSelectedEndMinute, 10);

    if (projectSelectedEndPeriod === "PM" && endHour < 12) endHour += 12;
    if (projectSelectedEndPeriod === "AM" && endHour === 12) endHour = 0;

    const combinedEndDate = new Date(
      Date.UTC(
        parseInt(endYear),
        parseInt(endMonth) - 1,
        parseInt(endDay),
        endHour,
        endMinute
      )
    );

    try {
      const payload = {
        ...formData,
        expoStartDate: combinedStartDate.toISOString(), // Convert to ISO string for JSON
        // expoEndDate: combinedEndDate.toISOString(),
      };

      const response = await fetch("http://localhost:8000/web/post-expo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      // Second POST after successful first one
      const secondaryResponse = await fetch(
        "http://localhost:8000/api/sent-expo-registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expoId: data.expoId,
            expoStartDate: combinedStartDate,
            // expoEndDate: combinedEndDate,
            ...formData,
          }),
        }
      );

      const secondaryData = await secondaryResponse.json();

      if (!secondaryResponse.ok) {
        throw new Error(
          secondaryData.error || "Failed to send registration confirmation"
        );
      }

      setSuccess(true);
      setExpoId(data.expoId);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-poppins py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 w-full h-full">
        <Image
          src={background}
          alt="Expo background"
          fill
          className="object-cover "
          quality={100}
          priority
        />
      </div>
      {/* <div className="absolute inset-0 bg-gradient-to-br from-rose-10 to-rose-800 opacity-90"></div> */}
      <div className="relative z-10 max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden md:max-w-screen-3xl transition-all duration-300 hover:shadow-2xl">
        <Head>
          <title>Expo Registration</title>
          <meta name="description" content="Register for our upcoming expo" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>

        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden md:max-w-screen-3xl transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 text-center">
            <h1 className="text-3xl font-bold text-white font-sans">
              Join Our Exclusive Expo
            </h1>
            <p className="mt-2 text-rose-100">
              Secure your spot at the most anticipated event of the year
            </p>
          </div>

          <div className="p-8">
            {success ? (
              <div className="animate-fade-in">
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 text-center shadow-sm">
                  <div className="flex justify-center mb-4">
                    <svg
                      className="h-12 w-12 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-green-800 font-semibold text-xl mb-2">
                    Registration Confirmed!
                  </div>
                  <p className="text-green-700 mb-4">
                    Thank you for registering. Your unique Expo ID is:
                  </p>
                  <div className="bg-green-100 border border-green-200 inline-block px-4 py-2 rounded-lg mb-4">
                    <span className="font-bold text-green-800 text-lg">
                      {expoId}
                    </span>
                  </div>
                  <p className="text-green-700 text-sm mb-6">
                    We have sent a confirmation email with event details.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Register Another Attendee
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 animate-fade-in"
              >
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start">
                    <svg
                      className="h-5 w-5 text-red-500 mt-0.5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="relative">
                    <label
                      htmlFor="firstName"
                      className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                      placeholder=""
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="lastName"
                      className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                    placeholder=""
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="phone"
                    className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700"
                  >
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Select booking start date:
                    </label>
                    <input
                      type="date"
                      value={projectSelectDate}
                      onChange={(e) => setProjectSelectedDate(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                      min={new Date().toISOString().split("T")[0]} // Sets the minimum date to today
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Select Time:
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={projectSelectedHour}
                        onChange={(e) => setProjectSelectedHour(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (hour) => (
                            <option
                              key={hour}
                              value={hour < 10 ? `0${hour}` : hour}
                            >
                              {hour < 10 ? `0${hour}` : hour}
                            </option>
                          )
                        )}
                      </select>
                      <select
                        value={projectSelectedMinute}
                        onChange={(e) =>
                          setProjectSelectedMinute(e.target.value)
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => i * 5).map(
                          (minute) => (
                            <option
                              key={minute}
                              value={minute < 10 ? `0${minute}` : minute}
                            >
                              {minute < 10 ? `0${minute}` : minute}
                            </option>
                          )
                        )}
                      </select>
                      <select
                        value={projectSelectedPeriod}
                        onChange={(e) =>
                          setProjectSelectedPeriod(e.target.value)
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Select booking end date:
                    </label>
                    <input
                      type="date"
                      value={projectSelectEndDate}
                      onChange={(e) =>
                        setProjectSelectedEndDate(e.target.value)
                      }
                      min={projectSelectDate}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Select Time:
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={projectSelectedEndHour}
                        onChange={(e) =>
                          setProjectSelectedEndHour(e.target.value)
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (hour) => (
                            <option
                              key={hour}
                              value={hour < 10 ? `0${hour}` : hour}
                            >
                              {hour < 10 ? `0${hour}` : hour}
                            </option>
                          )
                        )}
                      </select>
                      <select
                        value={projectSelectedEndMinute}
                        onChange={(e) =>
                          setProjectSelectedEndMinute(e.target.value)
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                      >
                        {Array.from({ length: 12 }, (_, i) => i * 5).map(
                          (minute) => (
                            <option
                              key={minute}
                              value={minute < 10 ? `0${minute}` : minute}
                            >
                              {minute < 10 ? `0${minute}` : minute}
                            </option>
                          )
                        )}
                      </select>
                      <select
                        value={projectSelectedEndPeriod}
                        onChange={(e) =>
                          setProjectSelectedEndPeriod(e.target.value)
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div> */}

                <div className="relative">
                  <label
                    htmlFor="message"
                    className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700"
                  >
                    Your Interests *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                    placeholder=""
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 ${
                      loading
                        ? "bg-rose-400"
                        : "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800"
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Securing Your Spot...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          ></path>
                        </svg>
                        Register Now
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center text-sm text-gray-500 mt-4">
                  <p>Limited seats available. Registration closes soon.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
