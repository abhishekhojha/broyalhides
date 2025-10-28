import Image from "next/image";
import Link from "next/link";

interface CategoryBoxProps {
  image: string;
  title: string;
  cta: string;
  href: string;
}

const CategoryBox = ({ image, title, cta, href }: CategoryBoxProps) => (
  <a
    href={href}
    className="group relative flex-1 min-w-[220px] max-w-xs aspect-[4/5] overflow-hidden shadow-xl transition-transform bg-black/70"
    style={{ textDecoration: 'none' }}
  >
    <Image
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-opacity group-hover:opacity-80"
      loading="lazy"
      fill
    />
    <div className="relative z-10 flex flex-col justify-end h-full p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-center">
      <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2 drop-shadow-lg font-serif">{title}</h3>
    </div>
  </a>
);

const categories = [
  {
    image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=760",
    title: "Jackets",
    cta: "Shop Now",
    href: "/shop/jackets",
  },
  {
    image: "/images/fshoes.png",
    title: "Shoes",
    cta: "Shop Now",
    href: "/shop/shoes",
  },
  {
    image: "https://images.unsplash.com/photo-1760624294514-ca40aafe3d96?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=930",
    title: "Bags",
    cta: "Shop Now",
    href: "/shop/bags",
  },
  {
    image: "https://images.unsplash.com/photo-1599066852653-42826a50b163?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=952",
    title: "Accessories",
    cta: "Shop Now",
    href: "/shop/accessories",
  },
];

const FeaturedCategories = () => (
  <section className="w-full max-w-7xl mx-auto py-16 px-4 md:px-8">
    <h2 className="text-3xl md:text-5xl text-center mb-10 font-serif text-primary font-semibold">
      Featured Categories
    </h2>
    <div className="flex flex-col md:flex-row justify-center items-stretch">
      {categories.map((cat) => (
        <CategoryBox key={cat.title} {...cat} />
      ))}
    </div>
  </section>
);

export default FeaturedCategories;
