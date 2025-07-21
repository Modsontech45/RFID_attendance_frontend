import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyPayment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string>("Verifying...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setStatus("❌ No payment reference found.");
      setLoading(false);
      return;
    }

    fetch(`https://rfid-attendancesystem-backend-project.onrender.com/api/paystack/verify?reference=${reference}`)
      .then((res) => res.json())
      .then((data: { status?: string; message?: string }) => {
        // Note: Your backend currently redirects on success/failure,
        // so if you want JSON response, backend must be adjusted.
        // For now, handle JSON response if backend sends it.

        if (data.status === "success") {
          setStatus("✅ Payment verified successfully.");
        } else if (data.status === "failed" || data.status === "error") {
          setStatus(`❌ Verification failed: ${data.message || "Unknown error"}`);
        } else {
          // Backend might redirect, so data may not contain status
          setStatus("⚠️ Verification completed. Please check your payment status.");
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Verification error", err);
        setStatus("❌ An error occurred during verification.");
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center p-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Payment Verification</h1>
        {loading ? (
          <p className="text-blue-600 animate-pulse">Please wait...</p>
        ) : (
          <p className="text-gray-700">{status}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyPayment;
