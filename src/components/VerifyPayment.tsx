import React, { useEffect, useState } from "react";
import Icon from "./icon.png"; // ✅ adjust the path to your icon file

const VerifyPayment: React.FC = () => {
  const [status, setStatus] = useState<string>("Verifying...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get("reference");

    if (!reference) {
      setStatus("❌ No payment reference found.");
      setLoading(false);
      return;
    }

    const verifyUrl = `https://rfid-attendancesystem-backend-project.onrender.com/api/paystack/verify/${reference}`;

    fetch(verifyUrl, { method: "GET", redirect: "manual" })
      .then(async (res) => {
        console.log("Response status:", res.status);
        if (res.status >= 300 && res.status < 400) {
          const location = res.headers.get("Location");
          console.log("Redirect Location:", location);

          if (location?.toLowerCase().includes("paymentsuccess")) {
            setStatus("✅ Payment verified successfully.");
          } else if (location?.toLowerCase().includes("paymentfailed")) {
            setStatus("❌ Payment verification failed.");
          } else {
            setStatus(`⚠️ Payment verification completed with unknown status. Redirected to: ${location}`);
          }
          setLoading(false);
        } else {
          try {
            const data = await res.json();
            console.log("JSON response data:", data);

            if (data.status === "success") {
              setStatus("✅ Payment verified successfully.");
            } else if (data.status === "failed" || data.status === "error") {
              setStatus(`❌ Verification failed: ${data.message || "Unknown error"}`);
            } else {
              setStatus("⚠️ Verification completed. Please check your payment status.");
            }
          } catch (jsonError) {
            console.error("Error parsing JSON:", jsonError);
            setStatus("❌ Received unexpected response format.");
          }
          setLoading(false);
        }
      })
      .catch((err: any) => {
        console.error("Verification error:", err);
        setStatus("❌ An error occurred during verification.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-black text-center p-4">
      <div className="flex items-center justify-center mb-0">
        <img src={Icon} alt="App Logo" className="h-24 w-24" />
      </div>
      <div className="bg-black bg-opacity-40 backdrop-blur-sm border border-blue-600 border-opacity-30 shadow-2xl rounded-xl p-8 max-w-md w-full">
        <h1 className="text-xl font-bold mb-4 text-white">Payment Verification</h1>
        {loading ? (
          <p className="text-blue-300 animate-pulse text-lg">Please wait...</p>
        ) : (
          <div>
            <p className="text-white text-lg mb-6">{status}</p>
            <button
              onClick={() => (window.location.href = "/admin/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPayment;
