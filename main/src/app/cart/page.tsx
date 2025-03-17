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

const EventCart: React.FC = () => {
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
          "http://localhost:8000/event-company-tax-value"
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

      const response = await fetch("http://localhost:8000/save-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Quote request sent successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        resetForm();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to save payment details.",
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl font-playfairDisplay">
              Wish List
            </h2>

            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
              <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                <div className="space-y-6">
                  {/* cart start */}
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => {
                      const totalPrice = item.perDayPricing * item.quantity;

                      return (
                        <div key={item.productId || index} className="rounded-lg border  border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                          <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                            <div className="shrink-0 md:order-1">
                              {item.singleImage ? (
                                <div>
                                  <img
                                    className="h-36 w-36 dark:hidden rounded"
                                    src={item.singleImage}
                                    alt="imac image"
                                  />
                                  <img
                                    className="hidden h-36 w-36 dark:block"
                                    src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                                    alt="imac image"
                                  />
                                </div>
                              ) : (
                                <img
                                  className="h-36 w-36 dark:hidden rounded"
                                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB4PSIwIiB5PSIwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxwYXRoIGQ9Ik03LjMyOCA1SDIxYTEuMDAxIDEuMDAxIDAgMCAxIDEgMXYxMC4yOTNsLTcuMTQ2LTcuMTQ3YS41LjUgMCAwIDAtLjcwNyAwbC0xLjA4NiAxLjA4NmEuNS41IDAgMCAwIC43MDcuNzA3bC43MzItLjczMiA3LjUgNy41VjE4YS45OTUuOTk1IDAgMCAxLS4zNTcuNzU3LjUuNSAwIDAgMCAuNjQ3Ljc2M0ExLjk5NCAxLjk5NCAwIDAgMCAyMyAxOFY2YTIuMDAyIDIuMDAyIDAgMCAwLTItMkg3LjMyOGEuNS41IDAgMCAwIDAgMVpNMjMuODU0IDIzLjE0NmwtMjMtMjNhLjUuNSAwIDAgMC0uNzA3LjcwN0wzLjI5MyA0SDNhMi4wMDIgMi4wMDIgMCAwIDAtMiAydjEyYTIuMDAyIDIuMDAyIDAgMCAwIDIgMmgxNi4yOTNsMy44NTQgMy44NTRhLjUuNSAwIDAgMCAuNzA3LS43MDdaTTcuMTUgNy44NTcgOS4xNDMgOS44NUExLjQ5IDEuNDkgMCAwIDEgNy4xNSA3Ljg1N1pNMyA1aDEuMjkzbDIuMTIxIDIuMTIyYTIuNSAyLjUgMCAwIDAgMy40NjQgMy40NjRsMS40MjcgMS40MjctMi41NDIgMi41NDMtMS45MS0xLjkxYS41LjUgMCAwIDAtLjcwNiAwTDIgMTYuNzkzVjZhMS4wMDEgMS4wMDEgMCAwIDEgMS0xWm0wIDE0YS45ODguOTg4IDAgMCAxLS45NjUtLjgyOEw2LjUgMTMuNzA3bDMuMTQ2IDMuMTQ2YS41LjUgMCAwIDAgLjcwNy0uNzA3bC0uODgzLS44ODMgMi41NDItMi41NDNMMTguMjkzIDE5WiIgZmlsbD0iI2JjMDAwMCIgb3BhY2l0eT0iMSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L3N2Zz4="
                                />
                              )}
                            </div>

                            <label htmlFor="counter-input" className="sr-only">
  Choose quantity:
</label>

                            <div className="flex items-center justify-between md:order-3 md:justify-end">
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(index, -1)
                                  }
                                  type="button"
                                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                >
                                  <svg
                                    className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 2"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M1 1h16"
                                    />
                                  </svg>
                                </button>

                                <input
                                  type="text"
                                  id="counter-input"
                                  className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                                  placeholder=""
                                  value={item.quantity}
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(index, 1)}
                                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                >
                                  <svg
                                    className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 18"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M9 1v16M1 9h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <div className="text-end md:order-4 md:w-32">
                                <p className="text-base  font-bold text-gray-900 dark:text-white">
                                  <span className="text-xl">
                                    Total ${totalPrice}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                              <a className="text-base font-medium text-gray-900 hover:underline dark:text-white">
                                {item.productDescription}
                              </a>

                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-2 text-xl font-medium text-rose-900 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                                >
                                  <strong>product price </strong>
                                  {item.perDayPricing}
                                </button>

                                <button
                                  type="button"
                                  className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                                  onClick={() => removeFromCart(item)}
                                >
                                  <svg
                                    className="me-1.5 h-5 w-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
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
                    <p className="text-gray-700 text-center py-6">
                      Your cart is empty.
                    </p>
                  )}
                  {/* cart end */}
                </div>
              </div>

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
                        placeholder="Enter first name"
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
                        placeholder="Enter last name"
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
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Phone number
                      </label>
                      <input
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        type="tel"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Enter phone number (US)"
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
                        placeholder="Type..."
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
                          placeholder="Enter a location"
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
                            placeholder="Enter address"
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
                            placeholder="Enter city"
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
                            placeholder="Enter state"
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
                            placeholder="Enter post code"
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
                        placeholder="Type..."
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
