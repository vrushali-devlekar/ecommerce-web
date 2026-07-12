import { motion } from "framer-motion";
import { TreePine, Hammer, Leaf, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AboutUs() {
  const navigate = useNavigate();

  const materials = [
    {
      name: "Neem Wood",
      benefit: "Antibacterial & Medicinal",
      description: "Naturally antiseptic, neem wood has been used for centuries in hair care to promote scalp circulation and reduce dandruff.",
      image: "https://images.unsplash.com/photo-1590156546746-c208c2b41985?w=600&q=80",
    },
    {
      name: "Organic Bamboo",
      benefit: "Ultra-Durable & Renewable",
      description: "Growing up to 3 feet a day, bamboo is one of the planet's most renewable resources, offering lightweight, resilient durability.",
      image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&q=80",
    },
    {
      name: "Sandalwood",
      benefit: "Aromatic & Calming",
      description: "Known for its smooth grains and deep, soothing aroma, sandalwood adds a touch of natural luxury to personal care accessories.",
      image: "https://images.unsplash.com/photo-1610057099443-fde8c4d90ef8?w=600&q=80",
    },
    {
      name: "Teak & Rosewood",
      benefit: "Heirloom Quality Timber",
      description: "Rich with natural protective oils, teak and rosewood timber pieces resist moisture decay while showing unique timber patterns.",
      image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&q=80",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5] text-zinc-900 overflow-hidden">
      {/* 1. HERO SECTION */}
      <div className="relative h-[80vh] min-h-[550px] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
        {/* Immersive background image with zoom transition */}
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80"
          className="h-full w-full object-cover object-center absolute inset-0 opacity-60 scale-105 transform hover:scale-100 transition-transform duration-[6000ms]"
          alt="Artisan Forest"
        />
        {/* Proper gradient overlay: dark vignette at top, fading out to show forest, and soft blend at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/20 to-transparent" />

        <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-semibold uppercase tracking-[0.6em] text-[#d9a014] block"
          >
            OUR HERITAGE
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-8xl font-serif text-white uppercase tracking-widest font-extrabold leading-tight"
          >
            BORN FROM FOREST
          </motion.h1>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-32 h-[3px] bg-[#d9a014] mx-auto rounded-full"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-zinc-300 text-xs md:text-sm uppercase tracking-[0.4em] font-light max-w-2xl mx-auto leading-relaxed"
          >
            redefining daily essentials through clean, sustainable, and handcrafted organic wood artistry.
          </motion.p>
        </div>

        {/* Animated Scroll Down Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.75, behavior: 'smooth' })}
        >
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.3em] mb-2">SCROLL DOWN</span>
          <div className="w-5 h-8 rounded-full border border-zinc-400/80 flex justify-center p-1">
            <div className="w-1.5 h-1.5 bg-[#d9a014] rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* 2. THE PHILOSOPHY */}
      <section className="py-24 container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9a014]">THE STORY OF WOODASA</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-zinc-900 uppercase leading-[1.1]">
                Rooted in Nature, Crafted for Life
              </h2>
            </div>
            <p className="text-zinc-600 text-sm md:text-base leading-relaxed font-light">
              At <strong className="font-semibold text-zinc-900">woodasa</strong>, we believe that the objects we interact with daily should carry a soul. Modern life is filled with synthetic, single-use plastics that clutter our homes and harm our environment. Our journey began with a simple mission: to replace everyday essentials with organic, warm, and biodegradable alternatives crafted from premium natural wood.
            </p>
            <p className="text-zinc-600 text-sm leading-relaxed font-light">
              Whether it is a Neem wood comb that naturally conditions your hair, a charcoal bamboo toothbrush that keeps your gums healthy, or a hand-turned rosewood bowl that turns dining into an occasion, our products celebrate the natural texture, grain, and warmth of organic timber.
            </p>
            
            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-start space-x-3">
                <Leaf className="w-5 h-5 text-[#d9a014] mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-800">100% Sustainable</h4>
                  <p className="text-[11px] text-zinc-500 font-light mt-0.5">Sourced from certified organic and responsibly managed forests.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Hammer className="w-5 h-5 text-[#d9a014] mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-800">Artisan Sculpted</h4>
                  <p className="text-[11px] text-zinc-500 font-light mt-0.5">Individually finished by local craftsmen to highlight the natural grain.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Overlapping Creative Image Block */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            {/* Background decorative box */}
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-[#d5ecd4] rounded-lg -z-10" />
            <div className="relative aspect-[4/5] w-[85%] overflow-hidden rounded-xl shadow-2xl border-4 border-white bg-zinc-200">
              <img
                src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=80"
                alt="Wood shaping"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Small floating tag */}
            <div className="absolute bottom-10 -right-4 bg-white px-6 py-4 rounded-lg shadow-xl border border-zinc-100 flex items-center space-x-3">
              <div className="bg-[#d5ecd4] p-2 rounded-full">
                <TreePine className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">CARBON NEUTRAL</p>
                <p className="text-xs font-bold text-zinc-800">10,000+ Trees Planted</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. MATERIAL GRID SHOWCASE */}
      <section className="py-24 bg-[#eae1df]/30 border-t border-b border-[#eae1df]/50">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9a014]">OUR MEDIUMS</span>
            <h3 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight text-zinc-900 leading-none md:whitespace-nowrap">
              The Woods We Work With
            </h3>
            <p className="text-zinc-500 text-sm font-light">
              Each type of wood is hand-selected for its physical strength, organic grain pattern, and unique natural benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {materials.map((mat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100 flex flex-col h-full group"
              >
                <div className="relative h-48 overflow-hidden bg-zinc-200">
                  <img
                    src={mat.image}
                    alt={mat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">{mat.benefit}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#d9a014] font-bold uppercase tracking-widest block">{mat.benefit}</span>
                    <h4 className="font-serif font-bold text-lg text-zinc-900 uppercase tracking-wide group-hover:text-[#d9a014] transition-colors">{mat.name}</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-light">{mat.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE ATELIER TIMELINE */}
      <section className="py-24 container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9a014]">THE CRAFT PROCESS</span>
          <h3 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight text-zinc-900 leading-none md:whitespace-nowrap">
            From Forest to Home
          </h3>
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-normal">Our commitment to zero waste and clean craft</p>
        </div>

        {/* Timeline representation */}
        <div className="relative border-l border-zinc-300/60 ml-4 md:ml-32 space-y-16">
          
          {/* Step 1 */}
          <div className="relative pl-8 md:pl-16 group">
            {/* Icon Dot */}
            <div className="absolute -left-4 top-1 w-8 h-8 rounded-full bg-[#d5ecd4] border-2 border-white shadow-md flex items-center justify-center text-emerald-800 transition-transform duration-300 group-hover:scale-110">
              <TreePine className="w-4 h-4" />
            </div>
            {/* Step Content */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d9a014]">STAGE 01 — ETHICAL HARVEST</span>
              <h4 className="font-serif font-bold text-xl text-zinc-900 uppercase">Naturally Sourced & Fallen Timber</h4>
              <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-2xl">
                We do not clear-cut trees. We source our timber exclusively from naturally fallen logs, small sustainable farming partnerships, and rapidly-renewable bamboo groves. Every harvest is certified organic and fully audited.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-8 md:pl-16 group">
            {/* Icon Dot */}
            <div className="absolute -left-4 top-1 w-8 h-8 rounded-full bg-[#f3eae1] border-2 border-white shadow-md flex items-center justify-center text-amber-800 transition-transform duration-300 group-hover:scale-110">
              <Hammer className="w-4 h-4" />
            </div>
            {/* Step Content */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d9a014]">STAGE 02 — HAND ARTISTRY</span>
              <h4 className="font-serif font-bold text-xl text-zinc-900 uppercase">Sculpted by Master Artisans</h4>
              <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-2xl">
                Our workshop utilizes traditional hand-turning lathes and chisels. Craftsmen detail each Neem comb teeth and Rosewood curves, finishing every piece with cold-pressed mustard, coconut, or sandalwood oils to naturally seal the wood.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pl-8 md:pl-16 group">
            {/* Icon Dot */}
            <div className="absolute -left-4 top-1 w-8 h-8 rounded-full bg-[#eae1df] border-2 border-white shadow-md flex items-center justify-center text-[#d9a014] transition-transform duration-300 group-hover:scale-110">
              <Leaf className="w-4 h-4" />
            </div>
            {/* Step Content */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d9a014]">STAGE 03 — ZERO-PLASTIC SHIELD</span>
              <h4 className="font-serif font-bold text-xl text-zinc-900 uppercase">Biodegradable Minimal Packaging</h4>
              <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-2xl">
                Our commitment to nature extends to delivery. We pack every order in recyclable kraft boxes, using soy-based inks and zero plastic tapes or fillers, ensuring your daily essentials arrive safely and decay naturally back into the soil.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. DYNAMIC LIGHT CTA SECTION */}
      <section className="relative py-24 bg-[#f5efe6] text-zinc-900 overflow-hidden flex flex-col items-center justify-center text-center px-4 border-t border-zinc-200/40">
        {/* Background micro-pattern in gold/brown */}
        <div className="absolute inset-0 bg-[radial-gradient(#d9a0141c_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative z-10 space-y-6 max-w-4xl">
          <Sparkles className="w-8 h-8 text-[#d9a014] mx-auto animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-wider text-zinc-900 leading-tight">
            Ready to Bring <br /> Natural Artistry Home?
          </h2>
          <p className="text-zinc-600 text-xs md:text-sm font-light max-w-md mx-auto leading-relaxed">
            Explore our crafted items of neem wood combs, organic bamboo brushes, and rustic teak tableware.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate("/shop/listing")}
              className="bg-[#d9a014] hover:bg-zinc-900 text-white font-bold text-xs tracking-widest px-10 py-5 rounded-none transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-300"
            >
              BROWSE COLLECTION
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutUs;
