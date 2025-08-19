import React, { useEffect, useState } from "react";
import { getApiKey } from "../utils/auth";
import { API_BASE } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { getAdminData } from "../utils/auth";
import { FormattedMessage, useIntl } from "react-intl";
import { useIntl as useLocalIntl } from "../context/IntlContext";

interface TimeSettingsData {
  sign_in_start: string;
  sign_in_end: string;
  sign_out_start: string;
  sign_out_end: string;
}

const TimeSettings: React.FC = () => {
  const { formatMessage } = useIntl();
  const apiKey = getApiKey();
  const adminData = getAdminData();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<TimeSettingsData | null>(null);
  const [form, setForm] = useState<TimeSettingsData>({
    sign_in_start: "",
    sign_in_end: "",
    sign_out_start: "",
    sign_out_end: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchTimeSettings() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/time-settings?api_key=${apiKey}`);
        if (!res.ok) throw new Error("Failed to fetch time settings");
        const data = await res.json();
        setSettings(data);
        setForm(data);
      } catch (err: any) {
        setMessage({
          type: "error",
          text: err.message || "Failed to load time settings.",
        });
      } finally {
        setLoading(false);
      }
    }
    if (apiKey) fetchTimeSettings();
  }, [apiKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/time-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, ...form }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Update failed");

      setSettings(form);
      setEditing(false);
      setMessage({
        type: "success",
        text: result.message || "Time settings updated successfully!",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update settings.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-green-900">
        <span className="text-green-400 text-lg font-semibold tracking-wide">
          Loading time settings...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full px-10 py-12 bg-gradient-to-r from-black via-gray-900 to-green-900 rounded-xl shadow-2xl text-white font-sans">
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wider drop-shadow-md">
          <FormattedMessage
            id="settime.header"
            defaultMessage="Sign In / Sign Out Time Settings"
          />
      
        </h2>

        {message && (
          <div
            role="alert"
            className={`mb-6 p-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              message.type === "success"
                ? "bg-green-900 text-green-300 border border-green-600 shadow-glow-green"
                : "bg-red-900 text-red-400 border border-red-600 shadow-glow-red"
            }`}
          >
            {message.text}
          </div>
        )}

        {!editing ? (
          <div className="space-y-6 text-lg leading-relaxed text-green-300">
            <p>
              <strong className="text-green-400">
                    <FormattedMessage
            id="settime.start"
            defaultMessage="Sign In Start:"
          />
                </strong>{" "}
              {settings?.sign_in_start}
            </p>
            <p>
              <strong className="text-green-400">
                             <FormattedMessage
            id="settime.startEnd"
            defaultMessage="Sign In End:"
          />
                </strong>{" "}
              {settings?.sign_in_end}
            </p>
            <p>
              <strong className="text-green-400">
                                       <FormattedMessage
            id="settime.endstart"
            defaultMessage="Sign Out Start:"
          />
               </strong>{" "}
              {settings?.sign_out_start}
            </p>
            <p>
              <strong className="text-green-400">
                                               <FormattedMessage
            id="settime.end"
            defaultMessage="Sign Out End:"
          />
                </strong>{" "}
              {settings?.sign_out_end}
            </p>
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black font-bold px-10 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
              >
                                                        <FormattedMessage
            id="settime.modifier"
            defaultMessage="Edit Time Settings"
          />
              
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              "sign_in_start",
              "sign_in_end",
              "sign_out_start",
              "sign_out_end",
            ].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-green-300 font-semibold mb-2 capitalize tracking-wide"
                >
                  {field.replaceAll("_", " ")}
                </label>
                <input
                  id={field}
                  type="time"
                  name={field}
                  value={form[field as keyof TimeSettingsData]}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 rounded-lg bg-black bg-opacity-60 border border-green-500 text-green-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                />
              </div>
            ))}
            <div className="flex justify-end gap-6 pt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black font-bold px-8 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
              >
                     <FormattedMessage
            id="settime.save"
            defaultMessage="Save"
          />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  if (settings) setForm(settings);
                }}
                className="bg-gray-800 hover:bg-gray-700 text-green-400 font-semibold px-8 py-3 rounded-xl shadow-inner transition"
              >
                       <FormattedMessage
            id="settime.cancel"
            defaultMessage="Cancel"
          />
              </button>
            </div>
          </form>
        )}
      </div>

      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mt-10 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black font-bold px-8 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
        type="button"
      >
               <FormattedMessage
            id="settime.home"
            defaultMessage="Go Home"
};

export default TimeSettings;
