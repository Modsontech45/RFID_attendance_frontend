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

    const verifyUrl = `https://rfid-attendancesystem-backend-project.onrender.com/api/paystack/verify/${reference}`;

    fetch(verifyUrl, {
      method: "GET",
      redirect: "manual", // Prevent automatic redirect following
    })
      .then(async (res) => {
        if (res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) {
          // Redirect detected, parse Location header
          const location = res.headers.get("Location");
          if (location?.includes("paymentsuccess")) {
            setStatus("✅ Payment verified successfully.");
          } else if (location?.includes("paymentfailed")) {
            setStatus("❌ Payment verification failed.");
          } else {
            setStatus("⚠️ Payment verification completed with unknown status.");
          }
          setLoading(false);
        } else {
          // Not a redirect, try parse JSON response
          const data = await res.json();
          if (data.status === "success") {
            setStatus("✅ Payment verified successfully.");
          } else if (data.status === "failed" || data.status === "error") {
            setStatus(`❌ Verification failed: ${data.message || "Unknown error"}`);
          } else {
            setStatus("⚠️ Verification completed. Please check your payment status.");
          }
          setLoading(false);
        }
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
