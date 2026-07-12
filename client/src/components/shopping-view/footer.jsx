import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Mail } from "lucide-react";

function ShoppingFooter() {
  return (
    <footer className="w-full bg-zinc-950 text-zinc-100 pt-16 pb-8 px-6 md:px-12 border-t border-white/5 relative overflow-hidden">
      {/* Background Soft Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="container relative mx-auto z-10 max-w-[1200px]">
        {/* Three Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: ABOUT US */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider border-b border-white/20 w-fit pb-1 text-white">
              ABOUT US
            </h4>
            <div className="flex flex-col space-y-2">
              <Link to="/shop/about" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                about us
              </Link>
              <Link to="/shop/about" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                our difference
              </Link>
              <Link to="/shop/about" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                community matters
              </Link>
              <Link to="/shop/about" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                press
              </Link>
              <Link to="/shop/about" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                woodasa video
              </Link>
              <Link to="/shop/blog" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                blog
              </Link>
            </div>
          </div>

          {/* Column 2: SERVICES */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider border-b border-white/20 w-fit pb-1 text-white">
              SERVICES
            </h4>
            <div className="flex flex-col space-y-2">
              <Link to="/shop/account" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                orders
              </Link>
              <Link to="/shop/contact" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                help center
              </Link>
              <Link to="/shop/returns" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                shipping
              </Link>
              <Link to="/shop/faq" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                terms of use
              </Link>
              <Link to="/shop/account" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                account detail
              </Link>
              <Link to="/shop/account" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
                my account
              </Link>
            </div>
          </div>

          {/* Column 3: NEWSLETTER */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider border-b border-white/20 w-fit pb-1 text-white">
              NEWSLETTER
            </h4>
            <div className="flex flex-col space-y-4">
              <p className="text-xs text-zinc-400 tracking-wide font-medium leading-relaxed">
                Sign up for the latest woodasa offers and exclusives
              </p>
              
              {/* Input + Subscribe Button Container */}
              <div className="flex items-stretch border border-white/10 max-w-sm rounded overflow-hidden shadow-sm">
                <input
                  type="email"
                  placeholder="email address.."
                  className="flex-1 bg-white text-zinc-800 placeholder-zinc-400 px-4 py-2 text-xs focus:outline-none"
                />
                <button className="bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] uppercase font-bold tracking-widest px-5 py-2 flex items-center gap-2 transition-colors border-l border-white/5">
                  Subscribe
                  <Mail className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Social Icons */}
              <div className="flex space-x-4 pt-2">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Youtube, href: "#" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Divider Line */}
        <div className="border-t border-white/10 my-6" />

        {/* Copyright Centered */}
        <div className="text-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
            &copy; {new Date().getFullYear()} woodasa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;
