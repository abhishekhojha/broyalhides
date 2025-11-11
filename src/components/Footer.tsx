
import { Instagram, Facebook } from "lucide-react";

const Footer = () => (
  <footer className="w-full bg-background border-t border-border">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-baseline justify-between gap-6">
      <div className="flex flex-col items-center md:items-start mr-4">
        <span className="text-xl font-bold font-serif text-primary mb-2">Broyal</span>
        <span className="text-sm text-muted-foreground">Premium Leather Goods & Modern Design</span>
        <span className="text-xs text-muted-foreground mt-2">© {new Date().getFullYear()} Broyal. All rights reserved.</span>
      </div>
      <nav className="grid grid-cols-2 md:grid-cols-4 w-full text-sm text-muted-foreground">
        <div>
          <span className="font-semibold text-primary mb-2 block">Shop</span>
          <ul className="space-y-1">
            <li><a href="/shop" className="hover:text-primary transition-colors">Shop All</a></li>
            <li><a href="/shop/jackets" className="hover:text-primary transition-colors">Jackets</a></li>
            <li><a href="/shop/shoes" className="hover:text-primary transition-colors">Shoes</a></li>
            <li><a href="/shop/bags" className="hover:text-primary transition-colors">Bags</a></li>
            <li><a href="/shop/accessories" className="hover:text-primary transition-colors">Accessories</a></li>
          </ul>
        </div>
        <div>
          <span className="font-semibold text-primary mb-2 block">Account</span>
          <ul className="space-y-1">
            <li><a href="/cart" className="hover:text-primary transition-colors">Cart</a></li>
            <li><a href="/wishlist" className="hover:text-primary transition-colors">Wishlist</a></li>
            <li><a href="/orders" className="hover:text-primary transition-colors">Orders</a></li>
            <li><a href="/returns" className="hover:text-primary transition-colors">Returns</a></li>
          </ul>
        </div>
        <div>
          <span className="font-semibold text-primary mb-2 block">Support</span>
          <ul className="space-y-1">
            <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <span className="font-semibold text-primary mb-2 block">Company</span>
          <ul className="space-y-1">
            <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
          </ul>
        </div>
      </nav>
      <div className="flex gap-4">
        <a href="https://instagram.com/broyal" target="_blank" rel="noopener" aria-label="Instagram" className="text-primary hover:text-primary/80">
          <Instagram className="w-6 h-6" strokeWidth={2} />
        </a>
        <a href="https://facebook.com/broyal" target="_blank" rel="noopener" aria-label="Facebook" className="text-primary hover:text-primary/80">
          <Facebook className="w-6 h-6" strokeWidth={2} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
