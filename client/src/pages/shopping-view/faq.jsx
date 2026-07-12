function FAQ() {
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International shipping varies by location, usually taking 7-14 business days."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide! Shipping costs and delivery times will be calculated at checkout based on your location."
    },
    {
      question: "Can I change or cancel my order?",
      answer: "We process orders very quickly, but if you contact us within 1 hour of placing your order, we will do our best to accommodate any changes or cancellations."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order has shipped, you will receive an email with your tracking number and a link to trace the delivery."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), Razorpay, UPI, and Apple Pay."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl min-h-[60vh]">
      <h1 className="text-4xl font-serif font-bold mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-12 text-center text-lg">
        Find answers to our most commonly asked questions below.
      </p>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-border pb-6">
            <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Still have questions? <a href="/shop/contact" className="text-foreground font-semibold underline underline-offset-4">Contact our support team</a>.
        </p>
      </div>
    </div>
  );
}

export default FAQ;
