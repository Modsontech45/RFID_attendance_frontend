import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import {
  Shield,
  Book,
  Code,
  Settings,
  Users,
  Wifi,
  Database,
  Lock,
  Zap,
  Globe,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Copy,
  CheckCircle,
  ExternalLink,
  Download,
  Play,
  Terminal,
  Smartphone,
  Server,
  Eye,
  EyeOff,
} from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const arduinoCode = `#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API configuration
const char* apiKey = "YOUR_API_KEY";
const char* deviceUID = "YOUR_DEVICE_UID";
const char* serverURL = "https://rfid-attendancesystem-backend-project.onrender.com";

// RFID pins
#define SS_PIN 21
#define RST_PIN 22

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  SPI.begin();
  mfrc522.PCD_Init();

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected!");

  // Update device status
  updateDeviceStatus();
}

void loop() {
  // Update device status every 30 seconds
  static unsigned long lastUpdate = 0;
  if (millis() - lastUpdate > 30000) {
    updateDeviceStatus();
    lastUpdate = millis();
  }

  // Check for RFID cards
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      uid += String(mfrc522.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();

    Serial.println("Card detected: " + uid);
    sendScanData(uid);

    mfrc522.PICC_HaltA();
    delay(2000); // Prevent multiple reads
  }

  delay(100);
}

void updateDeviceStatus() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(serverURL) + "/api/devices/heartbeat");
    http.addHeader("Content-Type", "application/json");

    DynamicJsonDocument doc(1024);
    doc["device_uid"] = deviceUID;
    doc["api_key"] = apiKey;

    String jsonString;
    serializeJson(doc, jsonString);

    int httpResponseCode = http.POST(jsonString);
    if (httpResponseCode > 0) {
      Serial.println("Device status updated");
    }
    http.end();
  }
}

void sendScanData(String uid) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(serverURL) + "/api/scan");
    http.addHeader("Content-Type", "application/json");

    DynamicJsonDocument doc(1024);
    doc["uid"] = uid;
    doc["device_uid"] = deviceUID;
    doc["api_key"] = apiKey;

    String jsonString;
    serializeJson(doc, jsonString);

    int httpResponseCode = http.POST(jsonString);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Scan sent: " + response);
    }
    http.end();
  }
}`;

const apiEndpoints = [
  {
    method: "POST",
    path: "/api/devices/register",
    description: "Register a new RFID device",
    example: `{
  "device_uid": "ESP32_001",
  "device_name": "Main Entrance",
  "api_key": "your_api_key"
}`,
  },
  {
    method: "GET",
    path: "/api/devices",
    description: "Get all registered devices",
    example: `GET /api/devices?api_key=your_api_key`,
  },
  {
    method: "POST",
    path: "/api/scan",
    description: "Submit RFID scan data",
    example: `{
  "uid": "A1B2C3D4",
  "device_uid": "ESP32_001",
  "api_key": "your_api_key"
}`,
  },
  {
    method: "GET",
    path: "/api/scan/queue",
    description: "Check for pending scans",
    example: `GET /api/scan/queue?device_uid=ESP32_001`,
  },
  {
    method: "POST",
    path: "/api/register",
    description: "Register a new student",
    example: `{
  "uid": "A1B2C3D4",
  "name": "John Doe",
  "email": "john@school.edu",
  "telephone": "+1234567890",
  "form": "Grade 10A",
  "gender": "Male",
  "api_key": "your_api_key"
}`,
  },
  {
    method: "GET",
    path: "/api/attendance",
    description: "Get attendance records",
    example: `GET /api/attendance?api_key=your_api_key`,
  },
];

const troubleshootingItems = [
  {
    icon: Wifi,
    problem: "Device shows as offline",
    cause: "WiFi connection issues or device not sending heartbeat",
    solution: "Check WiFi credentials, ensure device is powered, verify API key is correct",
  },
  {
    icon: Smartphone,
    problem: "documentation.troubleshooting.rfidNotDetected.problem",
    cause: "documentation.troubleshooting.rfidNotDetected.cause",
    solution: "documentation.troubleshooting.rfidNotDetected.solution",
  },
  {
    icon: Database,
    problem: "Scans not appearing in system",
    cause: "API communication failure or incorrect device UID",
    solution: "Check device UID matches registration, verify internet connection, check API key",
  },
  {
    icon: Terminal,
    problem: "Arduino compilation errors",
    cause: "Missing libraries or incorrect board configuration",
    solution: "Install required libraries (MFRC522, ArduinoJson), select correct ESP32 board",
  },
];

const DocumentationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["getting-started"]),
  );
  const [copiedCode, setCopiedCode] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    // Simulate loading translations or other data
    setTimeout(() => setLoading(false), 300);
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      newSet.has(sectionId) ? newSet.delete(sectionId) : newSet.add(sectionId);
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
            <Book className="h-6 w-6 animate-pulse text-white" />
          </div>
          <div className="text-xl text-gray-300">
            <FormattedMessage
              id="documentation.loading"
              defaultMessage="Loading Documentation..."
            />
          </div>
        </div>
      </div>
    );
  }
  const documentationSections = [
    {
      id: "getting-started",
      titleId: "documentation.gettingStarted.title",
      icon: Play,
      content: (
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6">
            <h4 className="mb-4 text-xl font-semibold text-blue-300">
              <FormattedMessage id="documentation.gettingStarted.welcome" />
            </h4>
            <p className="mb-4 text-gray-300">
              <FormattedMessage id="documentation.gettingStarted.description" />
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-black/30 p-4">
                <h5 className="mb-2 font-semibold text-white">
                  <FormattedMessage id="documentation.gettingStarted.forSchools" />
                </h5>
                <p className="text-sm text-gray-400">
                  <FormattedMessage id="documentation.gettingStarted.schoolsDesc" />
                </p>
              </div>
              <div className="rounded-lg bg-black/30 p-4">
                <h5 className="mb-2 font-semibold text-white">
                  <FormattedMessage id="documentation.gettingStarted.forOrganizations" />
                </h5>
                <p className="text-sm text-gray-400">
                  <FormattedMessage id="documentation.gettingStarted.organizationsDesc" />
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "hardware-setup",
      titleId: "documentation.hardwareSetup.title",
      icon: Wifi,
      content: (
        <div className="space-y-6">
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
            <h4 className="mb-4 text-xl font-semibold text-green-300">
              <FormattedMessage id="documentation.hardwareSetup.esp32Setup" />
            </h4>

            <div className="space-y-4">
              <div>
                <h5 className="mb-2 font-semibold text-white">
                  <FormattedMessage id="documentation.hardwareSetup.requiredComponents" />
                </h5>
                <ul className="list-inside list-disc space-y-1 text-gray-300">
                  {["esp32", "mfrc522", "rfidTags", "jumperWires", "breadboard"].map((key) => (
                    <li key={key}>
                      <FormattedMessage id={`documentation.hardwareSetup.components.${key}`} />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="mb-2 font-semibold text-white">
                  <FormattedMessage id="documentation.hardwareSetup.wiringDiagram" />
                </h5>
                <div className="rounded-lg bg-black/50 p-4 font-mono text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-2 text-green-400">
                        <FormattedMessage id="documentation.hardwareSetup.mappingsTitle" />
                      </div>
                      <div className="space-y-1 text-gray-300">
                        {[
                          "SDA → GPIO 21",
                          "SCK → GPIO 18",
                          "MOSI → GPIO 23",
                          "MISO → GPIO 19",
                          "IRQ → Not connected",
                          "GND → GND",
                          "RST → GPIO 22",
                          "3.3V → 3.3V",
                        ].map((line) => (
                          <div key={line}>{line}</div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded bg-gray-800 p-3">
                      <div className="mb-2 text-xs text-yellow-400">
                        ⚠️ <FormattedMessage id="documentation.hardwareSetup.importantNotes" />
                      </div>
                      <div className="space-y-1 text-xs text-gray-400">
                        {["use3v3", "doubleCheck", "ensureStable"].map((key) => (
                          <div key={key}>
                            • <FormattedMessage id={`documentation.hardwareSetup.notes.${key}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "arduino-code",
      titleId: "documentation.arduinoCode.title",
      icon: Code,
      content: (
        <div className="space-y-6">
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-6">
            <h4 className="mb-4 text-xl font-semibold text-purple-300">
              <FormattedMessage id="documentation.arduinoCode.title" />
            </h4>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h5 className="font-semibold text-white">
                    <FormattedMessage id="documentation.arduinoCode.completeCode" />
                  </h5>
                  <button
                    onClick={() => copyToClipboard(arduinoCode, "arduino-code")}
                    className="flex items-center space-x-2 rounded bg-purple-600 px-3 py-1 text-sm transition-colors hover:bg-purple-700"
                  >
                    {copiedCode === "arduino-code" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span>
                      {copiedCode === "arduino-code" ? (
                        <FormattedMessage
                          id="documentation.copy.copied"
                          defaultMessage={"Copied"}
                        />
                      ) : (
                        <FormattedMessage id="documentation.copy.copy" defaultMessage={"Copy"} />
                      )}
                    </span>
                  </button>
                </div>
                <div className="overflow-x-auto rounded-lg bg-black p-4">
                  <pre className="text-sm text-gray-300">
                    <code>{arduinoCode}</code>
                  </pre>
                </div>
              </div>

              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                <h6 className="mb-2 font-semibold text-yellow-300">
                  <FormattedMessage id="documentation.arduinoCode.configurationSteps" />
                </h6>
                <ol className="list-inside list-decimal space-y-1 text-gray-300">
                  <li>
                    Replace <code className="rounded bg-gray-700 px-1">YOUR_WIFI_SSID</code> with
                    your WiFi network name
                  </li>
                  <li>
                    Replace <code className="rounded bg-gray-700 px-1">YOUR_WIFI_PASSWORD</code>{" "}
                    with your WiFi password
                  </li>
                  <li>
                    Replace <code className="rounded bg-gray-700 px-1">YOUR_API_KEY</code> with your
                    Synctuario API key
                  </li>
                  <li>
                    Replace <code className="rounded bg-gray-700 px-1">YOUR_DEVICE_UID</code> with a
                    unique device identifier
                  </li>
                  <li>Upload the code to your ESP32</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "api-reference",
      titleId: "documentation.apiReference.title",
      icon: Server,
      content: (
        <div className="space-y-6">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6">
            <h4 className="mb-4 text-xl font-semibold text-cyan-300">
              <FormattedMessage id="documentation.apiReference.endpoints" />
            </h4>

            <div className="space-y-6">
              {apiEndpoints.map((endpoint, i) => (
                <div key={i} className="rounded-lg bg-black/30 p-4">
                  <div className="mb-3 flex items-center space-x-3">
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        endpoint.method === "GET"
                          ? "bg-green-600"
                          : endpoint.method === "POST"
                            ? "bg-blue-600"
                            : endpoint.method === "PUT"
                              ? "bg-yellow-600"
                              : endpoint.method === "DELETE"
                                ? "bg-red-600"
                                : "bg-gray-600"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-cyan-300">{endpoint.path}</code>
                  </div>
                  <p className="mb-3 text-gray-300">{endpoint.description}</p>

                  {endpoint.example && (
                    <div>
                      <div className="mb-2 flex justify-between text-sm text-gray-400">
                        <span>
                          <FormattedMessage id="documentation.apiReference.exampleLabel" />
                        </span>
                        <button
                          onClick={() => copyToClipboard(endpoint.example!, `api-${i}`)}
                          className="flex items-center space-x-1 hover:text-white"
                        >
                          {copiedCode === `api-${i}` ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>
                            <FormattedMessage id="documentation.copy.copy" />
                          </span>
                        </button>
                      </div>
                      <div className="overflow-x-auto rounded bg-gray-900 p-3">
                        <pre className="text-xs text-gray-300">
                          <code>{endpoint.example}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "user-management",
      titleId: "documentation.userManagement.title",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-6">
            <h4 className="mb-4 text-xl font-semibold text-orange-300">
              <FormattedMessage id="documentation.userManagement.managingUsers" />
            </h4>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-black/30 p-4">
                  <h5 className="mb-2 flex items-center space-x-2 font-semibold text-white">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span>
                      <FormattedMessage id="documentation.userManagement.adminUsers" />
                    </span>
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Full system access</li>
                    <li>• Manage devices and students</li>
                    <li>• View all reports</li>
                    <li>• Configure system settings</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-black/30 p-4">
                  <h5 className="mb-2 flex items-center space-x-2 font-semibold text-white">
                    <Users className="h-4 w-4 text-green-400" />
                    <span>
                      <FormattedMessage id="documentation.userManagement.teacherUsers" />
                    </span>
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• View student attendance</li>
                    <li>• Generate reports</li>
                    <li>• Update profile information</li>
                    <li>• Limited system access</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <h5 className="mb-2 font-semibold text-blue-300">
                  <FormattedMessage id="documentation.userManagement.registrationProcess" />
                </h5>
                <ol className="list-inside list-decimal space-y-1 text-gray-300">
                  <li>Student scans RFID card on registered device</li>
                  <li>If UID is new, registration form appears</li>
                  <li>Admin/Teacher fills out student information</li>
                  <li>Student is registered and can use the system</li>
                  <li>Future scans automatically log attendance</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      titleId: "documentation.security.title",
      icon: Lock,
      content: (
        <div className="space-y-6">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
            <h4 className="mb-4 text-xl font-semibold text-red-300">
              <FormattedMessage id="documentation.security.bestPractices" />
            </h4>

            <div className="space-y-4">
              <div className="rounded-lg bg-black/30 p-4">
                <h5 className="mb-2 flex items-center space-x-2 font-semibold text-white">
                  <Lock className="h-4 w-4 text-red-400" />
                  <span>
                    <FormattedMessage id="documentation.security.apiKeyManagement" />
                  </span>
                </h5>
                <div className="space-y-3">
                  <p className="text-sm text-gray-300">
                    Each admin account receives a unique API key for device communication. Keep this
                    key secure:
                  </p>

                  <div className="rounded bg-gray-900 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Example API Key:</span>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="flex items-center space-x-1 text-xs text-gray-400 transition-colors hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        <span>{showApiKey ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                    <code className="text-sm text-green-400">
                      {showApiKey
                        ? "sk_live_1234567890abcdef1234567890abcdef"
                        : "••••••••••••••••••••••••••••••••"}
                    </code>
                  </div>

                  <div className="rounded border border-yellow-500/30 bg-yellow-500/10 p-3">
                    <h6 className="mb-1 text-sm font-semibold text-yellow-300">
                      ⚠️ <FormattedMessage id="documentation.security.securityGuidelines" />
                    </h6>
                    <ul className="space-y-1 text-xs text-gray-300">
                      <li>• Never share your API key publicly</li>
                      <li>• Store keys securely in your ESP32 code</li>
                      <li>• Regenerate keys if compromised</li>
                      <li>• Use HTTPS for all API communications</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-black/30 p-4">
                <h5 className="mb-2 font-semibold text-white">
                  <FormattedMessage id="documentation.security.dataProtection" />
                </h5>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• All data is encrypted in transit and at rest</li>
                  <li>• Regular security audits and updates</li>
                  <li>• GDPR compliant data handling</li>
                  <li>• Secure user authentication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      titleId: "documentation.troubleshooting.title",
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-500/30 bg-gray-500/10 p-6">
            <h4 className="mb-4 text-xl font-semibold text-gray-300">
              <FormattedMessage id="documentation.troubleshooting.commonIssues" />
            </h4>

            <div className="space-y-4">
              {troubleshootingItems.map((item, index) => (
                <div key={index} className="rounded-lg bg-black/30 p-4">
                  <h5 className="mb-2 flex items-center space-x-2 font-semibold text-white">
                    <item.icon className="h-4 w-4 text-red-400" />
                    <FormattedMessage id={item.problem} defaultMessage={item.problem} />
                  </h5>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      <strong>Cause:</strong>{" "}
                      <FormattedMessage id={item.cause} defaultMessage={item.cause} />
                    </p>
                    <p>
                      <strong>Solution:</strong>{" "}
                      <FormattedMessage id={item.solution} defaultMessage={item.solution} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <header className="relative z-20 border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
              Synctuario
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate("/")} className="text-gray-300 hover:text-white">
              <FormattedMessage id="nav.home" defaultMessage="Home" />
            </button>
            <button onClick={() => navigate("/pricing")} className="text-gray-300 hover:text-white">
              <FormattedMessage id="nav.pricing" defaultMessage="Pricing" />
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        {/* Hero */}
        <section className="mb-16 space-y-8 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-4 py-2 text-blue-300">
            <Book className="h-4 w-4" />
            <span className="text-sm font-medium">
              <FormattedMessage
                id="documentation.hero.badge"
                defaultMessage="Complete Documentation"
              />
            </span>
          </div>
          <h1 className="text-5xl font-bold">
            <FormattedMessage id="documentation.hero.title" defaultMessage="Documentation" />
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            <FormattedMessage
              id="documentation.hero.subtitle"
              defaultMessage="Everything you need to know about setting up, configuring, and using the Synctuario RFID attendance system."
            />
          </p>
        </section>

        {/* Sections */}
        <section className="space-y-6">
          {documentationSections.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between p-6 hover:bg-white/5"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    <FormattedMessage id={section.titleId} defaultMessage="Section" />
                  </h3>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {expandedSections.has(section.id) && (
                <div className="animate-slide-up px-6 pb-6">{section.content}</div>
              )}
            </div>
          ))}
        </section>

        {/* Quick Links */}
        <section className="mt-16 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            <FormattedMessage id="documentation.quickLinks.title" defaultMessage="Quick Links" />
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <button
              onClick={() => navigate("/admin/login")}
              className="transform rounded-xl border border-white/20 bg-white/10 p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <Shield className="mx-auto mb-3 h-8 w-8 text-blue-400" />
              <h3 className="mb-2 font-semibold text-white">
                <FormattedMessage
                  id="documentation.quickLinks.adminPortal"
                  defaultMessage="Admin Portal"
                />
              </h3>
              <p className="text-sm text-gray-300">
                <FormattedMessage
                  id="documentation.quickLinks.adminDescription"
                  defaultMessage="Access the admin dashboard"
                />
              </p>
            </button>

            <button
              onClick={() => navigate("/teacher/login")}
              className="transform rounded-xl border border-white/20 bg-white/10 p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <Users className="mx-auto mb-3 h-8 w-8 text-green-400" />
              <h3 className="mb-2 font-semibold text-white">
                <FormattedMessage
                  id="documentation.quickLinks.teacherPortal"
                  defaultMessage="Teacher Portal"
                />
              </h3>
              <p className="text-sm text-gray-300">
                <FormattedMessage
                  id="documentation.quickLinks.teacherDescription"
                  defaultMessage="Access the teacher dashboard"
                />
              </p>
            </button>

            <button
              onClick={() => navigate("/pricing")}
              className="transform rounded-xl border border-white/20 bg-white/10 p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <Download className="mx-auto mb-3 h-8 w-8 text-purple-400" />
              <h3 className="mb-2 font-semibold text-white">
                <FormattedMessage
                  id="documentation.quickLinks.getStarted"
                  defaultMessage="Get Started"
                />
              </h3>
              <p className="text-sm text-gray-300">
                <FormattedMessage
                  id="documentation.quickLinks.pricingDescription"
                  defaultMessage="View pricing and plans"
                />
              </p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DocumentationPage;
