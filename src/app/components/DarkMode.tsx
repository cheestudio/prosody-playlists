"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/react";
import { IconSun, IconMoon } from '@tabler/icons-react';

const DarkMode = () => {

  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  const handleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setTheme('dark');
    }
    else {
      setTheme('light');
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;


  return (
    <Switch
      defaultSelected
      size="lg"
      color="secondary"
      startContent={<IconSun />}
      endContent={<IconMoon />}
      onChange={(e) => handleTheme(e)}
    >
    </Switch>
  );
}

export default DarkMode;
