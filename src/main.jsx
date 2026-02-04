import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

/* 🔒 Shown on Mobile & Tablet */
const DesktopOnlyScreen = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
        background: "#0f172a",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
        Desktop Required 🖥️
      </h1>
      <p style={{ maxWidth: "420px", lineHeight: 1.6, opacity: 0.85 }}>
        This application is optimized for desktop use only.
        <br />
        Please open it on a laptop or desktop computer for the best experience.
      </p>
    </div>
  );
};

const Root = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isDesktop ? <App /> : <DesktopOnlyScreen />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 🔥 MUST BE HERE */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          zIndex: 99999,
        },
      }}
    />

    <Root />
  </StrictMode>
);
