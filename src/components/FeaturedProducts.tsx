import Image from "next/image";

interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
    discountPrice?: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Classic Leather Jacket",
    image: "/images/fshoes.png",
    price: "₹24933",
    },
    {
      id: "2",
      name: "Modern Sneakers",
      image: "/images/fshoes.png",
      price: "₹12933",
      discountPrice: "₹99",
    },
    {
      id: "3",
      name: "Elegant Handbag",
      image: "/images/fshoes.png",
      price: "₹19933",
      discountPrice: "₹149",
    },
    {
      id: "4",
      name: "Minimalist Watch",
      image: "/images/fshoes.png",
      price: "₹8933",
      discountPrice: "₹69",
    },
    {
      id: "5",
      name: "Premium Boots",
      image: "/images/fshoes.png",
      price: "₹17933",
      discountPrice: "₹139",
    },
    {
      id: "6",
      name: "Statement Sunglasses",
      image: "/images/fshoes.png",
      price: "₹5933",
      discountPrice: "₹39",
    },
    {
      id: "7",
      name: "Urban Backpack",
      image: "/images/fshoes.png",
      price: "₹13933",
      discountPrice: "₹109",
    },
    {
      id: "8",
      name: "Shearling Jacket",
      image: "/images/fshoes.png",
      price: "₹29933",
      discountPrice: "₹249",
    },
];

const ProductCard = ({ product }: { product: Product }) => (
  <div className="group relative rounded-md overflow-hidden min-w-[270px] max-w-[340px] flex flex-col cursor-pointer">
    <div className="relative w-full aspect-[4/5]">
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        priority={false}
      />
    </div>
    <div className="flex-1 flex flex-col justify-between p-4 bg-black">
      <div>
        <h3 className="text-lg font-bold text-white mb-1 truncate font-serif">{product.name}</h3>
          {product.discountPrice ? (
            <>
              <span className="text-gray-400 text-base font-semibold line-through">{product.price}</span>
              <span className="text-gray-200 text-lg font-bold"> {product.discountPrice}</span>
            </>
          ) : (
            <span className="text-gray-200 text-base font-semibold">{product.price}</span>
          )}
      </div>
      <button className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-white font-semibold text-sm rounded-b-2xl backdrop-blur-sm cursor-pointer">
        Quick View
      </button>
    </div>
  </div>
);

const FeaturedProducts = () => (
  <section className="w-full max-w-7xl mx-auto pb-16 px-4 md:px-8">
    <h2 className="text-3xl md:text-5xl text-center mb-10 font-serif text-primary font-semibold">
      New Arrivals
    </h2>
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 min-w-full pb-2 px-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProducts;
