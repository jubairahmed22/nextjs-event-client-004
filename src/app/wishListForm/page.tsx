"use client";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

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

const WishListForm: React.FC = () => {
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
    });

    if (result.isConfirmed) {
      // Show loading indicator
      Swal.fire({
        title:
          "<span style='font-family: Poppins, sans-serif'>Processing...</span>",
        html: "<div style='font-family: Poppins, sans-serif'>Please wait while we process your request</div>",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          // Apply to all text in the modal
          const popup = Swal.getPopup();
          if (popup) {
            popup.style.fontFamily = "'Poppins', sans-serif";
          }
        },
      });

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
          totalPrice: totalCartPrice,
        };

        // First, save the payment data
        // Swal.update({
        //   title: "Saving payment details...",
        // });

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

        // Then send the email notification
        // Swal.update({
        //   title: "Sending confirmation email...",
        // });

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
              message: `Quote request for ${VenueName}. Total price: $${totalCartPrice}`,
              cartItems: cartItems.map((item) => ({
                title: item.title,
                quantity: item.quantity,
                price: item.perDayPricing,
                total: item.perDayPricing * item.quantity,
              })),
              totalPrice: totalCartPrice,
              startDate: combinedStartDate,
              endDate: combinedEndDate,
              venueNotes: VenueNotes,
            }),
          }
        );

        if (!emailResponse.ok) {
          throw new Error("Failed to send email notification");
        }

        // Success - close loading and show success message
        Swal.fire({
          title: "Success!",
          text: "Quote request sent successfully!",
          icon: "success",
          confirmButtonText: "OK",
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

  return (
    <div className="bg-rose-50 px-4">
      <div>
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 font-poppins ">
          <div className="mx-auto max-w-screen-2xl px-4 2xl:px-0">
            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
              <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full shadow-md border border-rose-50 rounded-xl p-5">
                <h1 className="text-3xl">Quote request form</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 w-full">
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
                          maxLength={13}
                          required
                        />
                      </div>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 mt-5">
                      Venue / Delivery Location
                    </p>
                    {/* Date and Time Selection */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Venue Name
                      </label>
                      <input
                        type="text"
                        value={VenueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                        required
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
                        Location Details
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
                      <input
                        type="text"
                        value={VenueNotes}
                        onChange={(e) => setVenueNotes(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
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

export default WishListForm;
