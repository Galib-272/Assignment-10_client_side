import HeroSlider from "@/components/home/HeroSlider";
import AdvertisedTickets from "@/components/home/AdvertisedTickets";
import LatestTickets from "@/components/home/LatestTickets";
import PopularRoutes from "@/components/home/PopularRoutes";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AdvertisedTickets />
      <LatestTickets />
      <PopularRoutes />
      <WhyChooseUs />
    </>
  );
}
