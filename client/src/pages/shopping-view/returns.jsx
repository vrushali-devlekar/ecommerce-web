function ShippingAndReturns() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl min-h-[60vh] prose prose-zinc">
      <h1 className="text-4xl font-serif font-bold mb-8">Shipping & Returns</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Shipping Information</h2>
        <p className="text-muted-foreground mb-4">
          We want to get your items to you as quickly as possible. Orders are typically processed within 24-48 hours.
        </p>
        
        <div className="bg-muted rounded-lg p-6 my-6">
          <ul className="space-y-3 mb-0">
            <li><strong>Standard Shipping (3-5 business days):</strong> ₹99 (Free on orders over ₹1000)</li>
            <li><strong>Express Shipping (1-2 business days):</strong> ₹299</li>
            <li><strong>International Shipping (7-14 business days):</strong> Calculated at checkout based on destination</li>
          </ul>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Once your order has shipped, you will receive a confirmation email containing your tracking number.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Return Policy</h2>
        <p className="text-muted-foreground mb-4">
          If you are not completely satisfied with your purchase, we accept returns within 30 days of the delivery date. Items must be in their original condition, unworn, unwashed, and with all tags still attached.
        </p>
        
        <h3 className="text-lg font-bold mt-6 mb-2">How to Return an Item</h3>
        <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
          <li>Access your account and go to "Orders" to initiate a return.</li>
          <li>Print the prepaid return shipping label we provide.</li>
          <li>Package your item(s) securely and attach the label to the outside.</li>
          <li>Drop off the package at any authorized shipping location.</li>
        </ol>
        
        <div className="bg-muted/50 p-4 rounded mt-6 border-l-4 border-primary">
          <p className="text-sm font-medium m-0">Please note: A return shipping fee of ₹100 will be deducted from your refund amount. Original shipping costs are non-refundable.</p>
        </div>
      </section>
    </div>
  );
}

export default ShippingAndReturns;
