import { createTheme } from "@mui/material/styles";
import "@fontsource/poppins";
import { createContext, useState, useMemo, useEffect } from "react";

// 100: "#001a1a",
// 200: "#001f1f",
// 300: "#002424",
// 400: "#002929",
// 500: "#002e2e",
// 600: "#003333",
// 700: "#1a4747",
// 800: "#335c5c",
// 900: "#4d7070",
// 950: "#668585",
// 100: "#e0ffce",
//           200: "#dbffc6",
//           300: "#d6ffbe",
//           400: "#d1ffb6",
//           500: "#ccffae",
//           600: "#b8e69d",
//           700: "#a3cc8b",
//           800: "#8fb37a",
//           900: "#7a9968",
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#99adad",
          200: "#99adad",
          300: "#809999",
          400: "#668585",
          500: "#4d7070",
          600: "#335c5c",
          700: "#1a4747",
          800: "#003333",
          900: "#002e2e",
          950: "#001a1a",
        },

        secondary: {
          100: "#f0ffe7",
          200: "#ebffdf",
          300: "#e6ffd7",
          400: "#e0ffce",
          500: "#dbffc6",
          600: "#d6ffbe",
          700: "#d1ffb6",
          800: "#ccffae",
          900: "#b8e69d",
        },
        black: {
          50: "#ffffff",
          100: "#FBFBFB",
          200: "#cccccc",
          300: "#b2b2b2",
          400: "#999999",
          500: "#7f7f7f",
          600: "#666666",
          700: "#4c4c4c",
          800: "#333333",
          900: "#101010",
          950: "#000000",
        },
        blackOnly: {
          500: "#000000",
        },
        whiteOnly: {
          500: "#ffffff",
        },
        redDark: {
          500: "#400000",
        },
        greenOnly: {
          500: "#003333",
        },
      }
    : {
        primary: {
          100: "#002e2e",
          200: "#003333",
          300: "#1a4747",
          400: "#335c5c",
          500: "#4d7070",
          600: "#668585",
          700: "#809999",
          800: "#99adad",
          900: "#99adad",
        },

        secondary: {
          100: "#b8e69d",
          200: "#ccffae",
          300: "#d1ffb6",
          400: "#d6ffbe",
          500: "#dbffc6",
          600: "#e0ffce",
          700: "#e6ffd7",
          800: "#ebffdf",
          900: "#f0ffe7",
        },
        black: {
          50: "#000000",
          100: "#191919",
          200: "#333333",
          300: "#4c4c4c",
          400: "#666666",
          500: "#7f7f7f",
          600: "#999999",
          700: "#b2b2b2",
          800: "#cccccc",
          900: "#F9F9F9",
          950: "#ffffff",
        },
        blackOnly: {
          500: "#000000",
        },
        whiteOnly: {
          500: "#ffffff",
        },
        redDark: {
          500: "#400000",
        },
        greenOnly: {
          500: "#003333",
        },
      }),
});

// MUI theme Settings

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.secondary[700],
            },
            secondary: {
              main: colors.primary[900],
            },
            neutral: {
              dark: colors.primary[100],
              main: colors.primary[100],
              light: colors.primary[100],
            },
            background: {
              default: colors.black[950],
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.secondary[100],
            },
            neutral: {
              dark: colors.primary[100],
              main: colors.primary[100],
              light: colors.primary[100],
            },
            background: {
              default: colors.black[950],
            },
          }),
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
      fontSize: 14,
      colors: colors.black[950],
      h1: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 17,
      },
      h6: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 15,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1366,
        xl: 1536,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  // const [mode, setMode] = useState("light");
  console.log("theme :", localStorage.getItem("theme"));
  const storage =
    localStorage.getItem("theme") !== "undefined"
      ? localStorage.theme
      : "light";

  const [storageTheme, setStorageTheme] = useState(storage);
  const [mode, setMode] = useState(storage);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );
  useEffect(() => {
    localStorage.setItem("theme", mode);
    setStorageTheme(mode);
  }, [storageTheme, mode]);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
