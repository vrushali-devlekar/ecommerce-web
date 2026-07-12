import { Calendar, User, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Neem Wood & Scalp Wellness: The Organic Alternative",
    excerpt: "Discover why switching from synthetic plastic combs to handcrafted Neem wood combs naturally conditions hair, stimulates blood flow, and reduces scalp irritation.",
    image: "https://images.unsplash.com/photo-1590156546746-c208c2b41985?w=800&q=80",
    date: "July 12, 2026",
    author: "Dr. Ananya Roy",
    category: "Scalp Wellness",
  },
  {
    id: 2,
    title: "The Culinary Timber: Sourcing Teak & Rosewood",
    excerpt: "A deep dive into our kitchenware crafting process. Why premium hardwoods like Teak and Rosewood are natural choices for water-resistant, food-safe kitchen tools.",
    image: "https://images.unsplash.com/photo-1594794312433-05a69a1356a0?w=800&q=80",
    date: "July 01, 2026",
    author: "Artisan Kabir",
    category: "Craftsmanship",
  },
  {
    id: 3,
    title: "Preserving Organic Grain: How to Care for Woodware",
    excerpt: "Natural timber items get more beautiful with age. Our essential guide to washing, air-drying, and sealing your wooden spoons and salad bowls using organic oils.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    date: "June 18, 2026",
    author: "Elena Rostova",
    category: "Timber Care",
  },
];

function Blog() {
  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5] text-zinc-900 overflow-hidden">
      {/* Hero Banner */}
      <div className="relative h-[380px] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=1600&q=80"
          className="h-full w-full object-cover object-center absolute inset-0 opacity-60 scale-105 transform hover:scale-100 transition-transform duration-[6000ms]"
          alt="woodasa Journal"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#faf8f5] to-transparent" />

        <div className="relative z-10 text-center space-y-4 animate-in fade-in zoom-in duration-700 px-4">
          <span className="text-xs font-semibold uppercase tracking-[0.6em] text-[#d9a014] block">The Journal</span>
          <h1 className="text-4xl md:text-6xl font-serif text-white uppercase tracking-[0.2em] font-extrabold">woodasa Log</h1>
          <div className="w-20 h-[2px] bg-[#d9a014] mx-auto rounded-full my-2" />
          <p className="text-zinc-300 text-xs md:text-sm uppercase tracking-[0.4em] font-light max-w-xl mx-auto leading-relaxed">
            Stories of organic timber, hand craftsmanship, and sustainable living
          </p>
        </div>
      </div>

      {/* Editorial Posts Grid */}
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <article 
              key={post.id} 
              className="group flex flex-col bg-white border border-zinc-200/80 hover:border-[#d9a014] transition-all duration-500 rounded-none shadow-sm hover:shadow-md overflow-hidden"
            >
              {/* Image Frame */}
              <div className="aspect-[16/10] overflow-hidden bg-zinc-100 relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-[#f5efe6] text-[#d9a014] text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 border border-[#d9a014]/20 rounded-none">
                  {post.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
                    <span className="flex items-center gap-1.5 font-sans">
                      <Calendar className="w-3.5 h-3.5 text-[#d9a014]" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-sans">
                      <User className="w-3.5 h-3.5 text-[#d9a014]" />
                      {post.author}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif font-bold text-zinc-900 group-hover:text-[#d9a014] transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3 font-light">
                    {post.excerpt}
                  </p>
                </div>

                {/* Read Action */}
                <div className="pt-6 border-t border-zinc-100 mt-6 font-sans">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 hover:text-[#d9a014] transition-colors flex items-center gap-2 group/btn">
                    Read Log
                    <ArrowRight className="w-3.5 h-3.5 text-[#d9a014] group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;
