import React, { useState, useEffect } from "react";
import Icon from "./icon.png"; // adjust path to your logo file

const SubscriptionCard = () => {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Replace with your actual subscription logic
    const subscriptionExpired = true;
    if (subscriptionExpired) {
      setShowCard(true);
    }
  }, []);

  const handleSubscribe = () => {
    window.location.href = "/pricing"; // or trigger Paystack
  };

  if (!showCard) return null;

  return (
    <div className="fixed top-48 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 rounded-2xl border border-red-500 bg-red-100 p-6 shadow-lg">
      {/* Logo Section */}
      <div className="flex justify-center mb-4">
        <img src={Icon} alt="App Logo" className="h-16 w-16" />
      </div>

      <h2 className="text-lg font-semibold text-red-700">
        Your subscription has expired
      </h2>
      <p className="mt-1 text-sm text-red-600">
        Please renew your plan to continue using all features.
      </p>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setShowCard(false)}
          className="rounded-lg border border-red-400 px-4 py-1 text-sm text-red-600 hover:bg-red-200"
        >
          Close
        </button>
        <button
          onClick={handleSubscribe}
          className="rounded-lg bg-red-600 px-4 py-1 text-sm text-white hover:bg-red-700"
        >
          Renew Now
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
