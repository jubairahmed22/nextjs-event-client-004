import { Event } from "@/types"; // Adjust the import path as needed
import CatValueDetailsPage from "./CatValueDetailsPage";
import { notFound } from "next/navigation";

// Define the type for the params object
interface PageParams {
  catValue: string;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  try {
    // Fetch all catValues from your API
    const response = await fetch("http://localhost:8000/category");
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const events: Event[] = await response.json();

    // Log the events to ensure they are fetched correctly
    console.log("Fetched categories:", events);

    // Return an array of objects with the catValue parameter
    return events.map((event) => ({
      catValue: event.catValue,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // Return an empty array in case of error
  }
}

export default async function Page({ params }: { params: { catValue: string } }) {
  // Log the params to ensure they are passed correctly
  console.log("Page params:", params);

  // Fetch categories to check if the current catValue is valid
  async function fetchCategories() {
    const response = await fetch("http://localhost:8000/category");
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    return await response.json();
  }

  // Check if the current catValue is valid
  const isValidCategory = async () => {
    const categories = await fetchCategories();
    return categories.some((event: Event) => event.catValue === params.catValue);
  };

  // Handle invalid catValue
  if (!(await isValidCategory())) {
    notFound(); // Redirect to 404 page
  }

  return <CatValueDetailsPage params={params} />;
  
}