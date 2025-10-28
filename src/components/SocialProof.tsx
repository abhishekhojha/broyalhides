import Image from "next/image";
import Link from "next/link";

const ugcPhotos = [
  {
    src: "/images/ugc/ugc1.jpg",
    alt: "Customer wearing Broyal jacket",
    productHref: "/shop/jackets/1",
    instaUrl: "https://www.instagram.com/reel/DOqZl0_knJv",
  },
  {
    src: "/images/ugc/ugc2.jpg",
    alt: "Customer with Broyal bag",
    productHref: "/shop/bags/1",
    instaUrl: "https://www.instagram.com/reel/DOuq1XOCNfO",
  },
  {
    src: "/images/ugc/ugc3.jpg",
    alt: "Customer showing Broyal shoes",
    productHref: "/shop/shoes/2",
    instaUrl: "https://www.instagram.com/reel/DJJj4NoojxV",
  },
  {
    src: "/images/ugc/ugc4.jpg",
    alt: "Customer styling Broyal accessories",
    productHref: "/shop/accessories/1",
    instaUrl: "https://instagram.com/reel/DO79OtWiLS8",
  },
  // Add more as needed
];

const SocialProof = () => (
  <section className="w-full max-w-7xl mx-auto pb-16 py-4 px-4 md:px-8">
    <h2 className="text-3xl md:text-5xl font-semibold text-center mb-10 font-serif text-primary">
      As Seen On You
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {ugcPhotos.filter(photo => photo.instaUrl).map((photo, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg bg-white flex items-center justify-center">
            <iframe
              src={`https://www.instagram.com/reel/${photo.instaUrl.split('/reel/')[1]?.replace(/\/$/, '')}/embed`}
              title={photo.alt}
              className="w-full h-full border-0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              loading="lazy"
              style={{ minHeight: 350, background: 'white' }}
            />
          </div>
          <Link
            href={photo.productHref}
            className="mt-2 text-xs text-primary underline hover:text-primary/80 transition-colors"
          >
            View Product
          </Link>
        </div>
      ))}
    </div>
  </section>
);

export default SocialProof;
