import HomeAboutCompo from "@/components/homeContent/HomeAboutCompo";
import HomeDiscountProduct from "@/components/homeContent/HomeDiscountProduct";
import HomeGalleryCompo from "@/components/homeContent/HomeGalleryCompo";
import HomeServiceCompo from "@/components/homeContent/HomeServiceCompo";
import HomeSliderCompo from "@/components/homeContent/HomeSliderCompo";
import HomeTestimonial from "@/components/homeContent/HomeTestimonial";
import CategoryHome from "@/components/shared/CategoryHome";
import EventHeroSection from "@/components/shared/EventHeroSection";
import HomeEvents from "@/components/shared/HomeEvents";
import HomeWishlist from "@/components/shared/HomeWishlist";
import InstaPost from "@/components/shared/InstaPost";

const HomePage = () => {
  return (
    <div>
      <EventHeroSection></EventHeroSection>
      <HomeAboutCompo></HomeAboutCompo>
      <HomeSliderCompo></HomeSliderCompo>
      {/* <HomeDiscountProduct></HomeDiscountProduct> */}
      <HomeServiceCompo></HomeServiceCompo>
      <HomeGalleryCompo></HomeGalleryCompo>
      <HomeTestimonial></HomeTestimonial>
      {/* <CategoryHome></CategoryHome> */}
      {/* <InstaPost></InstaPost> */}
      {/* <HomeWishlist></HomeWishlist>
      <HomeEvents></HomeEvents> */}
    </div>
  );
};

export default HomePage;
