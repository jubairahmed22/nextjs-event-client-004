"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import background from "../../assets/expo-3.jpg";
import Image from "next/image";

export default function ExpoForm() {
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
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("10");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("AM");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Set current date as default when component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    setSelectedDate(formattedDate);
  }, []);

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
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }

    setLoading(true);
    setError("");

    // Convert selected date and time to UTC
    const [year, month, day] = selectedDate.split("-");
    let hour = parseInt(selectedHour, 10);
    const minute = parseInt(selectedMinute, 10);

    if (selectedPeriod === "PM" && hour < 12) hour += 12;
    if (selectedPeriod === "AM" && hour === 12) hour = 0;

    const combinedStartDate = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), hour, minute)
    );

    try {
      const payload = {
        ...formData,
        expoStartDate: combinedStartDate.toISOString(),
      };

      // First API call
      const response = await fetch("https://server-gs.vercel.app/web/post-expo", {
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

      // Second API call
      const secondaryResponse = await fetch(
        "https://server-gs.vercel.app/api/sent-expo-registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expoId: data.expoId,
            expoStartDate: combinedStartDate,
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
      setSelectedDate("");
    } catch (err: any) {
      setError(err.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      timeSlots.push({
        value: `${displayHour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")} ${period}`,
        hour: hour.toString().padStart(2, "0"),
        minute: minute.toString().padStart(2, "0"),
        period,
      });
    }
  }

  // Calendar navigation functions
  const navigateMonth = (direction: number) => {
    const today = new Date();
    const currentDate = new Date(currentYear, currentMonth + direction, 1);

    // Don't allow navigation to past months/years
    if (currentDate < new Date(today.getFullYear(), today.getMonth(), 1)) {
      return;
    }

    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const navigateYear = (direction: number) => {
    const today = new Date();
    const newYear = currentYear + direction;

    // Don't allow navigation to past years
    if (newYear < today.getFullYear()) {
      return;
    }

    // If navigating to current year, make sure month is not in the past
    if (newYear === today.getFullYear() && currentMonth < today.getMonth()) {
      setCurrentMonth(today.getMonth());
    }

    setCurrentYear(newYear);
  };

  // Get days for current month view
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Check if a date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Generate calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dateStr = `${currentYear}-${(currentMonth + 1)
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      const isToday = dateObj.toDateString() === today.toDateString();
      const isSelected = selectedDate === dateStr;
      const isPast = isPastDate(dateObj);

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isPast && setSelectedDate(dateStr)}
          disabled={isPast}
          className={`h-10 rounded-full flex items-center justify-center transition-all duration-200
            ${
              isSelected
                ? "bg-rose-600 text-white"
                : isToday
                ? "border-2 border-rose-400"
                : isPast
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }
            ${
              dateObj.getDay() === 0 || dateObj.getDay() === 6
                ? isPast
                  ? "text-gray-300"
                  : "text-rose-500"
                : isPast
                ? "text-gray-300"
                : "text-gray-700"
            }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Check if navigation buttons should be disabled
  const today = new Date();
  const isPrevMonthDisabled =
    currentYear <= today.getFullYear() && currentMonth <= today.getMonth();
  const isPrevYearDisabled = currentYear <= today.getFullYear();

  return (
    <div className="min-h-screen font-poppins py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 w-full h-full">
        <Image
          src={background}
          alt="Expo background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-8">
          {success ? (
            <div className="animate-fade-in">
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 text-center shadow-sm">
                <div className="text-green-800 font-semibold text-xl mb-2">
                  Registration Confirmed!
                </div>
                <p className="text-green-700 mb-4">Your unique Expo ID is:</p>
                <div className="bg-green-100 border border-green-200 inline-block px-4 py-2 rounded-lg mb-4">
                  <span className="font-bold text-green-800 text-lg">
                    {expoId}
                  </span>
                </div>
                <p className="text-green-700 text-sm mb-6">
                  We have sent a confirmation email with event details.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    const today = new Date();
                    setCurrentMonth(today.getMonth());
                    setCurrentYear(today.getFullYear());
                    const formattedDate = `${today.getFullYear()}-${(
                      today.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, "0")}-${today
                      .getDate()
                      .toString()
                      .padStart(2, "0")}`;
                    setSelectedDate(formattedDate);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Register Another Attendee
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Join Our Exclusive Expo
                </h2>
                <p className="text-gray-600 mt-2">
                  Secure your spot at the most anticipated event of the year
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Calendar Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => navigateYear(-1)}
                      disabled={isPrevYearDisabled}
                      className={`p-1 rounded-full ${
                        isPrevYearDisabled
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateMonth(-1)}
                      disabled={isPrevMonthDisabled}
                      className={`p-1 rounded-full ${
                        isPrevMonthDisabled
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="text-lg font-medium text-gray-800">
                      {monthNames[currentMonth]} {currentYear}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateMonth(1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateYear(1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-gray-500 py-1"
                        >
                          {day}
                        </div>
                      )
                    )}
                    {renderCalendarDays()}
                  </div>
                </div>

                {/* Time Slot Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Select Time
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot, index) => {
                      const isSelected =
                        selectedHour === slot.hour &&
                        selectedMinute === slot.minute &&
                        selectedPeriod === slot.period;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setSelectedHour(slot.hour);
                            setSelectedMinute(slot.minute);
                            setSelectedPeriod(slot.period);
                          }}
                          className={`py-2 px-3 rounded-lg border transition-all duration-200 ${
                            isSelected
                              ? "bg-rose-600 text-white border-rose-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-rose-300"
                          }`}
                        >
                          {slot.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !selectedDate}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 ${
                    loading
                      ? "bg-rose-400"
                      : !selectedDate
                      ? "bg-gray-400 cursor-not-allowed"
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
                    "Confirm Registration"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
