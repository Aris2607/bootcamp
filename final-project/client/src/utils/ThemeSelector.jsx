import React, { useEffect, useState } from "react";

const ThemeSelector = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.className = theme; // Mengubah kelas body untuk tema
  }, [theme]);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme); // Simpan preferensi tema
  };

  return (
    <select
      id="theme-select"
      className="border p-2 w-full bg-white text-black dark:bg-gray-700 dark:text-white"
      value={theme}
      onChange={handleThemeChange}
    >
      <option value="light">Light Mode</option>
      <option value="dark">Dark Mode</option>
    </select>
  );
};

export default ThemeSelector;
