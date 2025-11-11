import SocialProof from "@/components/SocialProof";
import BrandStory from "@/components/BrandStory";
import FeaturedProducts from "@/components/FeaturedProducts";
import HeaderHero from "@/components/HeaderHero";
import FeaturedCategories from "@/components/FeaturedCategories";

export default function Home() {
  return (
    <>
      <HeaderHero />
      <FeaturedCategories />
      <FeaturedProducts />
      <BrandStory />
      <SocialProof />
    </>
  );
}
