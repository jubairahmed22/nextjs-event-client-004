"use client"; // Mark this as a Client Component

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface RentalDetails {
  _id: string;
  productId: string;
  category: string;
  catValue: string;
  singleImage: string;
  createdAt: string;
}

const RentalDetailsPage = () => {
  const params = useParams(); // Get the `id` from the URL
  const { id } = params;

  const [rental, setRental] = useState<RentalDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      // Fetch rental details using the `id`
      const fetchRentalDetails = async () => {
        try {
          const response = await axios.get<RentalDetails>(
            `http://localhost:8000/web/rental/${id}`
          );
          setRental(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching rental details:", error);
          setLoading(false);
        }
      };

      fetchRentalDetails();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!rental) {
    return <div>Rental not found.</div>;
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-rose-900">
        {rental.category}
      </h1>
      <img
        src={rental.singleImage}
        alt={rental.category}
        className="w-full h-96 object-cover rounded-xl mt-5"
      />
      <div className="mt-5 text-lg text-rose-900">
        <p>
          <strong>Product ID:</strong> {rental.productId}
        </p>
        <p>
          <strong>Category Value:</strong> {rental.catValue}
        </p>
        <p>
          <strong>Created At:</strong> {new Date(rental.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default RentalDetailsPage;