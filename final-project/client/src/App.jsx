// src/App.jsx
import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.className = savedTheme;
  }, []);

  return (
    <div className="dark:bg-gray-800">
      <AppRoutes />
    </div>
  );
};

export default App;
