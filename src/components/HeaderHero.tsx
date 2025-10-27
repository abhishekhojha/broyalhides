export const HeaderHero = () => (
  <header className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
    <video
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
      src="/videos/header.webm"
      autoPlay
      loop
      muted
      playsInline
    />
    {/* Gradient overlay */}
    <div className="absolute top-0 left-0 w-full h-full z-10 bg-black/80" />
    <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-4">
      <p className="text-2xl md:text-4xl text-white/80 max-w-3xl animate-fade-in-up delay-150 mb-8 font-serif">
        Elevate your legacy.
        <br className="hidden md:inline" /> Experience the new era of
        distinction.
      </p>
      {/* Call to action button */}
      <a
        href="#explore"
        className="inline-block px-8 py-3 rounded-md bg-white/90 text-black font-semibold shadow-lg hover:bg-white transition-all duration-200 animate-fade-in-up delay-300"
      >
        Explore Now
      </a>
      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 animate-bounce">
        <span
          className="block w-1.5 h-8 rounded-full bg-white/70 mb-2"
          style={{ boxShadow: "0 0 8px 2px rgba(255,255,255,0.3)" }}
        />
        <span className="text-white/70 text-xs tracking-widest">SCROLL</span>
      </div>
    </div>
  </header>
);

export default HeaderHero;
