"use client";
import axios from "axios";
import Link from "next/link";
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

const CartModalForm: React.FC = () => {
  // const [activeTab, setActiveTab] = useState<string>("tabCart");
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
        setError(err.message || "Something went wrong");
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
          setSelectedHour(hours % 12 || 12);
          setSelectedMinute(minutes < 10 ? `0${minutes}` : minutes);
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

  const handlePricingChange = (
    index: number,
    pricingType: string,
    pricingOption: string
  ) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].selectedPricingType = pricingType;
      updatedItems[index].selectedPricingOption = pricingOption;

      const pricingOptions =
        pricingType === "dailyPricing"
          ? updatedItems[index].dailyPricing
          : pricingType === "hourlyPricing"
          ? updatedItems[index].hourlyPricing
          : [];
      const selectedPrice = pricingOptions?.find(
        (price) => price[pricingOption] !== undefined
      );
      const priceValue = selectedPrice ? Object.values(selectedPrice)[0] : 0;
      updatedItems[index].selectedPricingValue = priceValue;

      setSelectedPricingValue(priceValue.toString());
      return updatedItems;
    });
  };

  const handleDateTimeChange = (
    index: number,
    date: string,
    hour: string,
    minute: string,
    period: string
  ) => {
    const formattedDate = new Date(
      `${date} ${hour}:${minute} ${period}`
    ).toISOString();

    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        selectedDate: formattedDate,
        selectedHour: hour,
        selectedMinute: minute,
        selectedPeriod: period,
      };
      return updatedItems;
    });
  };

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
      ? parseFloat(Object.values(selectedPrice)[0])
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
        container: "p-4 ",
        popup: "rounded-lg shadow-xl",
        title: "text-2xl font-bold font-montserrat text-gray-800",
        htmlContainer: "text-gray-600 font-montserrat mb-4",
        confirmButton:
          "bg-black hover:bg-gray-800 text-white font-montserrat font-medium py-2 px-4 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
        cancelButton:
          "bg-red-500 hover:bg-red-600 text-white font-medium font-montserrat py-2 px-4 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
        actions: "flex justify-end mt-4",
      },
      buttonsStyling: false,
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
          popup: "font-[Poppins]", // Ensures Poppins is applied to the entire modal
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
            popup.classList.add("font-montserrat"); // Apply Montserrat to the entire modal
          }
        },
        customClass: {
          popup: "font-montserrat", // Ensures Montserrat is applied to the entire modal
          title: "text-lg font-medium", // Optional: Adjust title styling
          htmlContainer: "text-gray-800", // Optional: Adjust text color
        },
        background: "white", // Optional: Set background
        backdrop: "rgba(0,0,0,0.5)", // Optional: Adjust backdrop opacity
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
            popup: "font-montserrat bg-white",
            title: "text-2xl",
            htmlContainer: "text-gray-700",
            confirmButton:
              "px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800",
          },
          buttonsStyling: false,
        });
        resetForm();
        localStorage.removeItem("cart");
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

  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");

  const inputRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDE9PduE1gTdXyEixCCxwpGgxTbN4o9-wo&libraries=places&v=beta";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeAutocomplete = () => {
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
          console.warn("No details available for input: '" + place.name + "'");
          return;
        }

        const addressComponents = place.address_components;
        let postCode = "",
          state = "",
          city = "",
          address = place.formatted_address;
        const fullAddress = place.name ? `${place.name}, ${address}` : address;

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

  useEffect(() => {
    if (activeTab === "tab2" && window.google) {
      initializeAutocomplete();
    }
  }, [activeTab, window.google]);

  return (
    <div className="cart-modal flex flex-col h-full bg-white rounded-lg shadow-xl font-poppins">
      <div className="p-5">
        {/* Tab Buttons */}

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("tab1")}
            aria-label="View Cart Items"
            className={`px-8 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${
              activeTab === "tab1"
                ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg hover:from-rose-700 hover:to-rose-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cart Items
          </button>
          <button
            onClick={() => setActiveTab("tab2")}
            aria-label="Proceed to Checkout"
            className={`px-8 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${
              activeTab === "tab2"
                ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg hover:from-rose-700 hover:to-rose-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Checkout
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-2 border border-gray-200 rounded-xl bg-gray-50 shadow-sm h-[560px] overflow-y-scroll">
          {activeTab === "tab1" && (
            <div>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                  const totalPrice = item.perDayPricing * item.quantity;

                  return (
                    <div
                      key={index}
                      className="mb-4 border-b border-gray-200 pb-8 last:border-b-0"
                    >
                      <div
                        onClick={() => toggleDropdown(index)}
                        className="cursor-pointer flex justify-between items-start hover:bg-gray-100 rounded-xl p-4 transition-all duration-300"
                      >
                        <div className="flex gap-6">
                          {item.singleImage ? (
                            <img
                              className="w-24 h-24 object-cover rounded-lg shadow-sm"
                              src={item.singleImage}
                              alt={item.title}
                              loading="lazy"
                            />
                          ) : (
                            <img
                              className="w-24 h-24 object-cover rounded-lg shadow-sm"
                              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB4PSIwIiB5PSIwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxwYXRoIGQ9Ik03LjMyOCA1SDIxYTEuMDAxIDEuMDAxIDAgMCAxIDEgMXYxMC4yOTNsLTcuMTQ2LTcuMTQ3YS41LjUgMCAwIDAtLjcwNyAwbC0xLjA4NiAxLjA4NmEuNS41IDAgMCAwIC43MDcuNzA3bC43MzItLjczMiA3LjUgNy41VjE4YS45OTUuOTk1IDAgMCAxLS4zNTcuNzU3LjUuNSAwIDAgMCAuNjQ3Ljc2M0ExLjk5NCAxLjk5NCAwIDAgMCAyMyAxOFY2YTIuMDAyIDIuMDAyIDAgMCAwLTItMkg3LjMyOGEuNS41IDAgMCAwIDAgMVpNMjMuODU0IDIzLjE0NmwtMjMtMjNhLjUuNSAwIDAgMC0uNzA3LjcwN0wzLjI5MyA0SDNhMi4wMDIgMi4wMDIgMCAwIDAtMiAydjEyYTIuMDAyIDIuMDAyIDAgMCAwIDIgMmgxNi4yOTNsMy44NTQgMy44NTRhLjUuNSAwIDAgMCAuNzA3LS43MDdaTTcuMTUgNy44NTcgOS4xNDMgOS44NUExLjQ5IDEuNDkgMCAwIDEgNy4xNSA3Ljg1N1pNMyA1aDEuMjkzbDIuMTIxIDIuMTIyYTIuNSAyLjUgMCAwIDAgMy40NjQgMy40NjRsMS40MjcgMS40MjctMi41NDIgMi41NDMtMS45MS0xLjkxYS41LjUgMCAwIDAtLjcwNiAwTDIgMTYuNzkzVjZhMS4wMDEgMS4wMDEgMCAwIDEgMS0xWm0wIDE0YS45ODguOTg4IDAgMCAxLS45NjUtLjgyOEw2LjUgMTMuNzA3bDMuMTQ2IDMuMTQ2YS41LjUgMCAwIDAgLjcwNy0uNzA3bC0uODgzLS44ODMgMi41NDItMi41NDNMMTguMjkzIDE5WiIgZmlsbD0iI2JjMDAwMCIgb3BhY2l0eT0iMSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L3N2Zz4="
                            />
                          )}

                          <div className="flex flex-col justify-center">
                            <Link href={`/all-products/${item._id}`} passHref>
                              <h1 className="text-md hover:underline font-semibold text-gray-900">
                                {item.title}
                              </h1>
                            </Link>

                            <p className="text-sm font-semibold text-rose-700">
                              Quantity:{" "}
                              <span className="font-bold">{item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className={`w-6 h-6 text-gray-700 transform transition-transform ${
                              dropdownVisible[index] ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                      {dropdownVisible[index] && (
                        <div className="mt-6 bg-rose-50 p-6 rounded-xl animate-fade-in">
                          <div className="space-y-6">
                            <div>
                              <div className="flex flex-row gap-4 w-full justify-between">
                                <h1 className="text-md font-semibold text-rose-900">
                                  Price:{" "}
                                  <span className="font-bold">
                                    {item.perDayPricing} $
                                  </span>
                                </h1>
                                <form className="w-full flex flex-col justify-center items-center">
                                  <label className="text-md font-semibold text-rose-900 mb-1">
                                    Choose quantity:
                                  </label>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(index, -1)
                                      }
                                      type="button"
                                      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-l-xl p-3 h-12 focus:ring-2 focus:ring-gray-100 focus:outline-none"
                                    >
                                      <svg
                                        className="w-4 h-4 text-gray-900"
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
                                    <span className="bg-gray-50 border-x-0 border-gray-300 h-12 text-center text-gray-900 text-md font-bold px-4 py-3">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(index, 1)
                                      }
                                      type="button"
                                      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-r-xl p-3 h-12 focus:ring-2 focus:ring-gray-100 focus:outline-none"
                                    >
                                      <svg
                                        className="w-4 h-4 text-gray-900"
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
                                </form>
                                <h1 className="text-md font-semibold text-rose-900">
                                  Total:{" "}
                                  <span className="font-bold">
                                    {totalPrice} $
                                  </span>
                                </h1>
                              </div>
                              <p className="text-sm mt-2 text-justify">
                                {item.productDescription}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item)}
                              type="button"
                              className="flex items-center text-sm font-medium text-red-600 hover:underline"
                            >
                              <svg
                                className="mr-2 h-6 w-6"
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
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:shadow-xl">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 p-3">
                    <svg
                      className="h-10 w-10 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-gray-900 font-montserrat">
                    Start adding products to see them here
                  </h3>

                  <div className="mt-6">
                    <Link href="/all-products">
                      <button className="inline-flex items-center rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 font-montserrat">
                        <svg
                          className="-ml-1 mr-2 h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                        Browse All Products
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "tab2" && (
            <div className="space-y-8">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModalForm;
