import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BrandStory = () => (
  <section className="w-full max-w-7xl mx-auto pb-16 px-4 md:px-8 flex flex-col md:flex-row items-center gap-12 md:gap-20">
    {/* Image Side */}
    <div className="flex-1 w-full max-w-lg relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
      <Image
        src="/images/brand-story/craft.jpg"
        alt="Craftsman working on leather"
        fill
        className="object-cover object-center"
        priority={false}
      />
    </div>
    {/* Text Side */}
    <div className="flex-1 w-full max-w-xl flex flex-col items-start justify-center">
      <h2 className="text-3xl md:text-5xl mb-6 font-serif text-gray-900">
        Timeless Quality. Modern Design.
      </h2>
      <p className="text-base md:text-xl text-gray-700 mb-8">
        At Broyal, every piece is crafted with passion and precision. We use
        only the finest materials, blending traditional techniques with modern
        design for products that last. Our commitment to quality and sustainable
        sourcing ensures you wear more than fashion—you wear a legacy.
      </p>
      <Link href="#about" className="py-4 px-6 bg-gray-900 text-white rounded-md">Learn Our Story</Link>
    </div>
  </section>
);

export default BrandStory;
