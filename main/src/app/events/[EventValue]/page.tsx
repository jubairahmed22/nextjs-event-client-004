import EventDetailsPage from "./EventDetailsPage";
import { notFound } from "next/navigation";

// Define the Event type
interface Event {
  _id: string;
  productId: string;
  EventTitle: string;
  EventValue: string;
  singleImage: string;
  createdAt: string;
}

// Define the type for the params object
interface PageParams {
  EventValue: string;
}

// Define the type for the props of the Page component
interface PageProps {
  params: PageParams;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  try {
    // Fetch all event values from your API
    const response = await fetch("http://localhost:8000/eventCollection");
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    const events: Event[] = await response.json();

    // Log the events to ensure they are fetched correctly
    console.log("Fetched events:", events);

    // Return an array of objects with the EventValue parameter
    return events.map((event) => ({
      EventValue: event.EventValue,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return []; // Return an empty array in case of error
  }
}

export default function Page({ params }: PageProps) {
  // Log the params to ensure they are passed correctly
  console.log("Page params:", params);

  // Fetch events to check if the current EventValue is valid
  async function fetchEvents() {
    const response = await fetch("http://localhost:8000/eventCollection");
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    return await response.json();
  }

  // Check if the current EventValue is valid
  const isValidEvent = async () => {
    const events = await fetchEvents();
    return events.some((event: Event) => event.EventValue === params.EventValue);
  };

  // Handle invalid EventValue
  if (!isValidEvent()) {
    notFound(); // Redirect to 404 page
  }

  return <EventDetailsPage params={params} />;
}