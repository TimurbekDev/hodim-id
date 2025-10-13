import { Switch } from "antd";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <Switch
      checked={isDark}
      onChange={() => setIsDark(!isDark)}
      checkedChildren="🌙"
      unCheckedChildren="☀️"
    />
  );
};

export default ThemeSwitcher;
