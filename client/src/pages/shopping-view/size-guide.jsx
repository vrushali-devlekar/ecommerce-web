function SizeGuide() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[60vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold mb-4">Size Guide</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Use the charts below to find your perfect fit. Our sizes run true to size unless otherwise noted in the product description. Measurements are in inches.
        </p>
      </div>
      
      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Men's Sizing
            <div className="h-px bg-border flex-grow ml-4"></div>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-border">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="border border-zinc-200 p-3 font-semibold">Size</th>
                  <th className="border border-zinc-200 p-3 font-semibold">Chest</th>
                  <th className="border border-zinc-200 p-3 font-semibold">Waist</th>
                  <th className="border border-zinc-200 p-3 font-semibold">Neck</th>
                  <th className="border border-zinc-200 p-3 font-semibold">Arm Length</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr><td className="border border-zinc-200 p-3 font-medium">S</td><td className="border border-zinc-200 p-3">36-38</td><td className="border border-zinc-200 p-3">29-31</td><td className="border border-zinc-200 p-3">14-14.5</td><td className="border border-zinc-200 p-3">32.5-33</td></tr>
                <tr className="bg-zinc-50/50"><td className="border border-zinc-200 p-3 font-medium">M</td><td className="border border-zinc-200 p-3">39-41</td><td className="border border-zinc-200 p-3">32-34</td><td className="border border-zinc-200 p-3">15-15.5</td><td className="border border-zinc-200 p-3">33.5-34</td></tr>
                <tr><td className="border border-zinc-200 p-3 font-medium">L</td><td className="border border-zinc-200 p-3">42-44</td><td className="border border-zinc-200 p-3">35-37</td><td className="border border-zinc-200 p-3">16-16.5</td><td className="border border-zinc-200 p-3">34.5-35</td></tr>
                <tr className="bg-zinc-50/50"><td className="border border-zinc-200 p-3 font-medium">XL</td><td className="border border-zinc-200 p-3">45-48</td><td className="border border-zinc-200 p-3">38-41</td><td className="border border-zinc-200 p-3">17-17.5</td><td className="border border-zinc-200 p-3">35.5-36</td></tr>
                <tr><td className="border border-zinc-200 p-3 font-medium">XXL</td><td className="border border-zinc-200 p-3">49-52</td><td className="border border-zinc-200 p-3">42-45</td><td className="border border-zinc-200 p-3">18-18.5</td><td className="border border-zinc-200 p-3">36.5-37</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="bg-muted p-8 rounded-lg mt-12 text-center">
            <h3 className="font-bold text-lg mb-2">How to Measure</h3>
            <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
              For the most accurate measurements, have someone else measure you while wearing lightweight clothing. 
              Keep the tape measure straight and snug, but not tight.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SizeGuide;
