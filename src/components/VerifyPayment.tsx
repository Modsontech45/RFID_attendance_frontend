import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyPayment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reference = searchParams.get("reference");
    if (!reference) {
      setStatus("❌ No payment reference found.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `https://rfid-attendancesystem-backend-project.onrender.com/api/paystack/verify/${reference}`
        );
        const data = await res.json();

        if (data.status === "success") {
          setStatus("✅ Payment verified successfully.");
        } else {
          setStatus(`❌ Verification failed: ${data.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("❌ An error occurred during verification.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-center">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Payment Verification</h1>
        <p className={loading ? "text-blue-600 animate-pulse" : "text-gray-700"}>
          {status}
        </p>
      </div>
    </div>
  );
};

export default VerifyPayment;
