"use client";
import React from "react";

function ThemeHook() {
  const [theme, setTheme] = React.useState("light");
  React.useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const updateTheme = () => {
    setTheme(
      localStorage.getItem("theme") === "dark" ? "light" : "dark"
    );
  };

  return {
    theme,
    setTheme,
    updateTheme,
  };
}

export default ThemeHook;
