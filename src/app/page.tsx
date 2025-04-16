import CategoryHome from "@/components/shared/CategoryHome";
import EventHeroSection from "@/components/shared/EventHeroSection";
import HomeEvents from "@/components/shared/HomeEvents";
import HomeWishlist from "@/components/shared/HomeWishlist";
import InstaPost from "@/components/shared/InstaPost";

const HomePage = () => {
  return (
    <div>
      <EventHeroSection></EventHeroSection>
      <CategoryHome></CategoryHome>
      {/* <InstaPost></InstaPost> */}
      {/* <HomeWishlist></HomeWishlist>
      <HomeEvents></HomeEvents> */}
    </div>
  );
};

export default HomePage;
