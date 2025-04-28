"use client";
import { Product } from "./types";

interface StatsCardsProps {
  products: Product[];
}

export const StatsCards = ({ products }: StatsCardsProps) => {
  const totalProducts = products.reduce((total, product) => total + product.quantity, 0);
  const availableProducts = products.reduce((total, product) => total + product.availableQuantity, 0);
  const bookedProducts = products.reduce((total, product) => total + product.bookedQuantity, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <StatCard label="Total Products" value={totalProducts} />
      <StatCard label="Available Products" value={availableProducts} />
      <StatCard label="Booked Products" value={bookedProducts} />
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);