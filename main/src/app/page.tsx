import EventHeroSection from "@/components/shared/EventHeroSection";
import HomeEvents from "@/components/shared/HomeEvents";
import HomeWishlist from "@/components/shared/HomeWishlist";

const HomePage = () => {
  return (
    <div>
      <EventHeroSection></EventHeroSection>
      <HomeWishlist></HomeWishlist>
      <HomeEvents></HomeEvents>
    </div>
  );
};

export default HomePage;
