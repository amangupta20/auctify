const HowItWorksPage = () => {
  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl mb-8 text-center">How It Works</h1>

        <div className="space-y-12">
          {/* Buyer Section */}
          <section className="bg-secondary rounded-lg p-6">
            <h2 className="text-2xl mb-4">For Buyers</h2>
            <div className="space-y-4">
              <p>
                1. Browse through available auctions and find items you're
                interested in.
              </p>
              <p>
                2. Place your bid on items - make sure it's higher than the
                current highest bid.
              </p>
              <p>
                3. If you win, you'll be notified and can proceed with the
                payment.
              </p>
            </div>
          </section>

          {/* Seller Section */}
          <section className="bg-secondary rounded-lg p-6">
            <h2 className="text-2xl mb-4">For Sellers</h2>
            <div className="space-y-4">
              <p>1. Create an account and verify your details.</p>
              <p>2. List your item with clear photos and descriptions.</p>
              <p>3. Set a starting price and auction duration.</p>
              <p>
                4. Once the auction ends, coordinate with the winning bidder.
              </p>
            </div>
          </section>

          {/* General Rules */}
          <section className="bg-secondary rounded-lg p-6">
            <h2 className="text-2xl mb-4">General Rules</h2>
            <div className="space-y-4">
              <p>• All bids are final and binding.</p>
              <p>• Sellers must accurately describe their items.</p>
              <p>• Payment must be made within 48 hours of auction end.</p>
              <p>• Contact support for any disputes or issues.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default HowItWorksPage;
