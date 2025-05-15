"use client";
import axios from "axios";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";


interface CartItem {
  _id: string;
  singleImage: string;
  title: string;
  productId: string;
  quantity: number;
  selectedDate?: string;
  contractDescription: string;
  productDescription: string;
  internalNotes: string;
  length: number;
  height: number;
  shape: string;
  width: number;
  productCode: string;
  perDayPricing: number;
  selectedPricingType?: string;
  selectedPricingOption?: string;
  selectedPricingValue?: number;
  dailyPricing?: { [key: string]: number }[]; // Add this
  hourlyPricing?: { [key: string]: number }[]; // Add this
}

interface PaymentData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postCode: string;
  VenueNotes: string;
  projectSelectDate: Date;
  projectSelectEndDate: Date;
  set: {
    setCode: string;
    setTitle: string;
    startDate: Date;
    endDate: Date;
    products: {
      singleImage: string;
      title: string;
      productId: string;
      quantity: number;
      selectedDate: string;
      contractDescription: string;
      productDescription: string;
      internalNotes: string;
      length: number;
      height: number;
      shape: string;
      width: number;
      productCode: string;
      selectedPricingValue: number;
      tax: number;
      productTotal: number;
    }[];
  }[];
  totalPrice: number;
}

const EventCart = () => {
  const [activeTab, setActiveTab] = useState<string>("tabCart");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [selectedMinute, setSelectedMinute] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [VenueName, setVenueName] = useState<string>("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postCode, setPostCode] = useState("");
  const [VenueNotes, setVenueNotes] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedPricingValue, setSelectedPricingValue] = useState<string>("");
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
  const [error, setError] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ taxValue: number }>(
          "https://server-gs.vercel.app/event-company-tax-value"
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        // Type guard to check if err is an instance of Error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      }
    };

    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const updateCartData = () => {
      const storedCartData = localStorage.getItem("cart");
      if (storedCartData) {
        const parsedCart: CartItem[] = JSON.parse(storedCartData);
        setCartItems(parsedCart);

        if (parsedCart[0]?.selectedDate) {
          const date = new Date(parsedCart[0].selectedDate);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          setSelectedDate(date.toISOString().split("T")[0]);
          setSelectedHour(String(hours % 12 || 12)); // Convert to string
          setSelectedMinute(minutes < 10 ? `0${minutes}` : String(minutes)); // Ensure string
          setSelectedPeriod(hours >= 12 ? "PM" : "AM");
        }
      }
    };

    updateCartData();
    const intervalId = setInterval(updateCartData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      // Prevent setting empty cart on first load
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const handleQuantityChange = useCallback(
    (index: number, increment: number) => {
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              quantity: Math.max(1, item.quantity + increment),
            };
          }
          return item;
        });
        return updatedItems;
      });
    },
    []
  );

  const removeFromCart = (productToRemove: CartItem) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter(
        (product) => product._id !== productToRemove._id
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage immediately
      return updatedCart;
    });
  };

  // const handlePricingChange = (
  //   index: number,
  //   pricingType: string,
  //   pricingOption: string
  // ) => {
  //   setCartItems((prevItems) => {
  //     const updatedItems = [...prevItems];
  //     updatedItems[index].selectedPricingType = pricingType;
  //     updatedItems[index].selectedPricingOption = pricingOption;

  //     const pricingOptions =
  //       pricingType === "dailyPricing"
  //         ? updatedItems[index].dailyPricing
  //         : pricingType === "hourlyPricing"
  //         ? updatedItems[index].hourlyPricing
  //         : [];
  //     const selectedPrice = pricingOptions?.find(
  //       (price) => price[pricingOption] !== undefined
  //     );
  //     const priceValue = selectedPrice ? Object.values(selectedPrice)[0] : 0;
  //     updatedItems[index].selectedPricingValue = priceValue;

  //     setSelectedPricingValue(priceValue.toString());
  //     return updatedItems;
  //   });
  // };

  // const handleDateTimeChange = (
  //   index: number,
  //   date: string,
  //   hour: string,
  //   minute: string,
  //   period: string
  // ) => {
  //   const formattedDate = new Date(
  //     `${date} ${hour}:${minute} ${period}`
  //   ).toISOString();

  //   setCartItems((prevItems) => {
  //     const updatedItems = [...prevItems];
  //     updatedItems[index] = {
  //       ...updatedItems[index],
  //       selectedDate: formattedDate,
  //       selectedHour: hour,
  //       selectedMinute: minute,
  //       selectedPeriod: period,
  //     };
  //     return updatedItems;
  //   });
  // };

  const totalCartPrice = cartItems.reduce((total, item) => {
    const selectedPricingType = item.selectedPricingType || "dailyPricing";
    const selectedPricingOption = item.selectedPricingOption || "OneDay";
    const pricingOptions =
      selectedPricingType === "dailyPricing"
        ? item.dailyPricing
        : selectedPricingType === "hourlyPricing"
        ? item.hourlyPricing
        : [];
    const selectedPrice = pricingOptions?.find(
      (price) => price[selectedPricingOption] !== undefined
    );
    const priceValue = selectedPrice
      ? Object.values(selectedPrice)[0] // Directly use the number value
      : 0;
    return total + priceValue * item.quantity;
  }, 0);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setVenueName("");
    setAddress(""),
      setCity(""),
      setPostCode(""),
      setState(""),
      setVenueNotes("");
    setPhoneNumber("");
    setSelectedPricingValue("");
    setProjectSelectedDate("");
    setProjectSelectedHour("12");
    setProjectSelectedMinute("00");
    setProjectSelectedPeriod("AM");
    setProjectSelectedEndDate("");
    setProjectSelectedEndHour("12");
    setProjectSelectedEndMinute("00");
    setProjectSelectedEndPeriod("AM");
    setCartItems([]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to send a quote request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it!",
      cancelButtonText: "No, cancel!",
      customClass: {
        container: 'p-4 ',
        popup: 'rounded-lg shadow-xl',
        title: 'text-2xl font-bold font-montserrat text-gray-800',
        htmlContainer: 'text-gray-600 font-montserrat mb-4',
        confirmButton: 'bg-black hover:bg-gray-800 text-white font-montserrat font-medium py-2 px-4 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
        cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-medium font-montserrat py-2 px-4 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50',
        actions: 'flex justify-end mt-4'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      // Show the warning note before proceeding
      await Swal.fire({
        title: "⚠ Please Note:",
        html: `
          <div class="text-left  font-montserrat">
            <p class="mb-3">This is only a quote request, not a confirmed reservation.</p>
            <p class="mb-3">To check availability, receive final pricing, and secure your reservation, please speak directly with an associate.</p>
            <ul class="list-disc pl-5 mb-3 space-y-1">
              <li>Delivery and additional fees are not included in this estimate.</li>
              <li>A deposit is required for most reservations.</li>
            </ul>
            <p class="mt-3">Thank you for your understanding!</p>
          </div>
        `,
        icon: "warning",
        confirmButtonText: "I understood",
        confirmButtonColor: "#000000",
        customClass: {
          popup: 'font-[Poppins]', // Ensures Poppins is applied to the entire modal
        },
      });

      // Show loading indicator
      Swal.fire({
        title: "<span class='font-montserrat mt-5'>Processing...</span>",
        html: "<div class='font-montserrat'>Please wait while we process your request</div>",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          const popup = Swal.getPopup();
          if (popup) {
            popup.classList.add('font-montserrat'); // Apply Montserrat to the entire modal
          }
        },
        customClass: {
          popup: 'font-montserrat', // Ensures Montserrat is applied to the entire modal
          title: 'text-lg font-medium', // Optional: Adjust title styling
          htmlContainer: 'text-gray-800', // Optional: Adjust text color
        },
        background: 'white', // Optional: Set background
        backdrop: 'rgba(0,0,0,0.5)', // Optional: Adjust backdrop opacity
      });

      // Rest of your existing code...
      try {
        const generateSetCode = () => {
          return Math.random().toString(36).substr(2, 8).toUpperCase();
        };

        const setCode = generateSetCode();

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

        const allProductPrice = cartItems.reduce(
          (sum, item) => sum + item.perDayPricing * item.quantity,
          0
        );

        const combinedEndDate = new Date(
          Date.UTC(
            parseInt(endYear),
            parseInt(endMonth) - 1,
            parseInt(endDay),
            endHour,
            endMinute
          )
        );

        const paymentData: PaymentData = {
          firstName,
          lastName,
          phoneNumber,
          email,
          address,
          city,
          state,
          postCode,
          VenueNotes,
          projectSelectDate: combinedStartDate,
          projectSelectEndDate: combinedEndDate,
          set: [
            {
              setCode,
              setTitle: VenueName,
              startDate: combinedStartDate,
              endDate: combinedEndDate,
              products: cartItems.map((item) => {
                const priceValue = item.perDayPricing;
                const productTotal = item.perDayPricing * item.quantity;

                return {
                  singleImage: item.singleImage,
                  title: item.title,
                  productId: item.productId,
                  quantity: item.quantity,
                  selectedDate: item.selectedDate || "",
                  contractDescription: item.contractDescription,
                  productDescription: item.productDescription,
                  internalNotes: item.internalNotes,
                  length: item.length,
                  height: item.height,
                  shape: item.shape,
                  width: item.width,
                  productCode: item.productCode,
                  selectedPricingValue: priceValue,
                  tax: data?.taxValue || 0,
                  productTotal,
                };
              }),
            },
          ],
          totalPrice: allProductPrice,
        };

        const paymentResponse = await fetch(
          "https://server-gs.vercel.app/save-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
          }
        );

        if (!paymentResponse.ok) {
          throw new Error("Failed to save payment details");
        }

        const emailResponse = await fetch(
          "https://server-gs.vercel.app/api/sent-cart-details",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              phone: phoneNumber,
              message: `Quote request for ${VenueName}. Total price: $${allProductPrice}`,
              cartItems: cartItems.map((item) => ({
                title: item.title,
                quantity: item.quantity,
                price: item.perDayPricing,
                total: item.perDayPricing * item.quantity,
              })),
              totalPrice: allProductPrice,
              startDate: combinedStartDate,
              endDate: combinedEndDate,
              venueNotes: VenueNotes,
            }),
          }
        );

        if (!emailResponse.ok) {
          throw new Error("Failed to send email notification");
        }

        Swal.fire({
          title: "<span class='font-montserrat font-semibold'>Success!</span>",
          html: "<div class='font-montserrat'>Quote request sent successfully!</div>",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#000000", // Black background
          customClass: {
            popup: 'font-montserrat bg-white',
            title: 'text-2xl',
            htmlContainer: 'text-gray-700',
            confirmButton: 'px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800',
          },
          buttonsStyling: false,
        });
        resetForm();
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while processing your request.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  
  const toggleDropdown = (index: number) => {
    setDropdownVisible((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3 && value.length <= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
        6,
        10
      )}`;
    } else if (value.length > 3) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    setPhoneNumber(value);
  };

  useEffect(() => {
    setProjectSelectedEndDate((prevEndDate) => {
      if (prevEndDate && prevEndDate < projectSelectDate) {
        return projectSelectDate;
      }
      return prevEndDate;
    });
  }, [projectSelectDate]);

  const inputRef = useRef(null);

  useEffect(() => {
    // Load the Google Maps API script dynamically
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyASJ8-qp5vbTQ_Z3ZHqPyo0Ls-MVzv5NTk&libraries=places&v=beta";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize the autocomplete after the script has loaded
      if (inputRef.current && window.google) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: [
              "formatted_address",
              "geometry",
              "name",
              "address_components",
            ],
            strictBounds: false,
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) {
            console.warn(
              "No details available for input: '" + place.name + "'"
            );
            return;
          }

          const addressComponents = place.address_components;
          let postCode = "",
            state = "",
            city = "",
            address = place.formatted_address;
          const fullAddress = place.name
            ? `${place.name}, ${place.formatted_address}`
            : place.formatted_address || ""; // Fallback to empty string if undefined

          setAddress(fullAddress); // Now fullAddress is guaranteed to be a string
          setCity(city);
          setState(state);
          setPostCode(postCode);
          // Check if addressComponents is defined before using it
          if (addressComponents) {
            addressComponents.forEach((component) => {
              if (component.types.includes("postal_code")) {
                postCode = component.long_name;
              }
              if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
              }
              if (component.types.includes("locality")) {
                city = component.long_name;
              }
            });
          }

          setAddress(fullAddress);
          setCity(city);
          setState(state);
          setPostCode(postCode);
        });

        console.log("Autocomplete initialized successfully");
      } else {
        console.error(
          "Input ref is not attached to any element or Google Maps API not loaded"
        );
      }
    };

    return () => {
      // Clean up the script when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  
  const text = "Wish List";
  const letters = text.split("");

  return (
    <div className="px-4">
      <div>
        <section className="py-4 antialiased dark:bg-white md:py-16 font-poppins ">
          <div className="mx-auto max-w-screen-3xl lg:px-4 px-0 2xl:px-0">
          <motion.div className="text-start lg:px-6 px-0 mb-4 lg:mb-16">
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

            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start lg:gap:2 xl:gap-2">
              <div className="mx-auto w-full flex-none lg:max-w-screen-4xl xl:max-w-5xl">
  <div className="mx-auto w-full flex-none lg:max-w-screen-4xl xl:max-w-5xl bg-white p-4 rounded-lg">
  <div className="space-y-6">
    {/* cart start */}
    {currentItems.length > 0 ? (
      currentItems.map((item, index) => {
        const totalPrice = item.perDayPricing * item.quantity;

        return (
          <div
            key={item.productId || index}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-300 dark:bg-white"
          >
            <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
              <div className="shrink-0 md:order-1">
                {item.singleImage ? (
                  <div className="relative">
                    <img
                      className="h-36 w-36 rounded-lg object-cover"
                      src={item.singleImage}
                      alt={item.title}
                    />
                  </div>
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-lg bg-gray-100">
                    <svg
                      className="h-16 w-16 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M7.328 5H21a1 1 0 0 1 1 1v10.293l-7.146-7.147a.5.5 0 0 0-.707 0l-1.086 1.086a.5.5 0 0 0 .707.707l.732-.732 7.5 7.5V18a.995.995 0 0 1-.357.757.5.5 0 0 0 .647.763A1.994 1.994 0 0 0 23 18V6a2.002 2.002 0 0 0-2-2H7.328a.5.5 0 0 0 0 1zm16.526 18.146l-23-23a.5.5 0 0 0-.707.707L3.293 4H3a2.002 2.002 0 0 0-2 2v12a2.002 2.002 0 0 0 2 2h16.293l3.854 3.854a.5.5 0 0 0 .707-.707ZM7.15 7.857 9.143 9.85A1.49 1.49 0 0 1 7.15 7.857zM3 5h1.293l2.121 2.122a2.5 2.5 0 0 0 3.464 3.464l1.427 1.427-2.542 2.543-1.91-1.91a.5.5 0 0 0-.706 0L2 16.793V6a1.001 1.001 0 0 1 1-1zm0 14a.988.988 0 0 1-.965-.828L6.5 13.707l3.146 3.146a.5.5 0 0 0 .707-.707l-.883-.883 2.542-2.543L18.293 19z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between md:order-3 md:justify-end">
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(index, -1)}
                    type="button"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <svg
                      className="h-3 w-3 text-gray-800"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 2"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h16"
                      />
                    </svg>
                  </button>

                  <input
                    type="number"
                    id="counter-input"
                    className="w-16 shrink-0 border-0 bg-white text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 1;
                      handleQuantityChange(
                        index,
                        newQuantity - item.quantity
                      );
                    }}
                    min="1"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => handleQuantityChange(index, 1)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
                  >
                    <svg
                      className="h-3 w-3 text-gray-800"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 1v16M1 9h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-end md:order-4 md:w-32">
                  <p className="text-lg font-bold text-gray-900">
                    ${totalPrice?.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                <Link 
                  href={`/all-products/${item._id}`} 
                  passHref
                  className="group"
                >
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 group-hover:underline transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-gray-700 line-clamp-2">
                  {item.productDescription}
                </p>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-gray-700">
                    <span className="text-gray-500">Price: </span>
                    ${item.perDayPricing?.toFixed(2)}/day
                  </span>

                  <button
                    type="button"
                    className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
                    onClick={() => removeFromCart(item)}
                  >
                    <svg
                      className="mr-1.5 h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18 17.94 6M18 18 6.06 6"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <div className="rounded-lg border border-gray-700 bg-white p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Your cart is empty
        </h3>
        <p className="mt-2 text-gray-600">
          Start adding some products to see them here
        </p>
      </div>
    )}
    
    {currentItems.length > 0 && (
      <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-700">
            Order Summary
          </h3>
          <div className="text-2xl font-bold text-gray-900">
            ${currentItems.reduce(
              (sum, item) => sum + item.perDayPricing * item.quantity,
              0
            )?.toFixed(2)}
          </div>
        </div>
      </div>
    )}
  </div>
</div>
</div>

              <div className="mx-auto mt-6 max-w-2xl flex-1 space-y-6 lg:mt-0 lg:w-full shadow-md border border-rose-50 rounded-xl p-5">
                <h1 className="text-3xl">Quote request form</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 w-full">
                    <p className="text-xl font-semibold text-gray-900 mt-5">
                    Your Contact Info
                    </p>
                    <div className="flex flex-row gap-5 items-center w-full">
                      <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                          required
                        />
                      </div>

                      <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center w-full">
                      <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                          required
                        />
                      </div>
                      <div className="w-full">
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          Phone number (US)
                        </label>
                        <input
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          type="tel"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                          maxLength={14}
                          required
                        />
                      </div>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-5">
                      Date / Time
                    </p>
                    {/* Date and Time Selection */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={VenueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                        required
                        placeholder="Alexs Wedding / Anas Sweets"
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
                          onChange={(e) =>
                            setProjectSelectedDate(e.target.value)
                          }
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
                            onChange={(e) =>
                              setProjectSelectedHour(e.target.value)
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="mt-8">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Venue / Location Details
                      </h2>
                      <div className="w-full">
                        <input
                          ref={inputRef}
                          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5 mt-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Post Code
                          </label>
                          <input
                            type="text"
                            value={postCode}
                            onChange={(e) => setPostCode(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Venue Notes
                      </label>
                      <textarea
                        value={VenueNotes}
                        onChange={(e) => setVenueNotes(e.target.value)}
                        className="w-full p-2.5 border h-44 border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Please type any info that will help us direction or other instruction for the event"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-medium rounded-lg focus:ring-4 focus:outline-none focus:ring-rose-300"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventCart;
