import React from "react";

const CommonLoader = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        backgroundColor: "rgba(2, 8, 23, 0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <span
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            animation: "dotPulse 1.4s infinite ease-in-out",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
            animationDelay: "0s",
          }}
        />
        <span
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            animation: "dotPulse 1.4s infinite ease-in-out",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
            animationDelay: "0.2s",
          }}
        />
        <span
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            animation: "dotPulse 1.4s infinite ease-in-out",
            boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
            animationDelay: "0.4s",
          }}
        />
      </div>
    </div>
  );
};

export default CommonLoader;
