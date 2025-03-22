import "@emotion/react";

// Extend Emotion's theme type
declare module "@emotion/react" {
  export interface Theme {
    colors: {
      background: string;
      surface: string;
      text: {
        primary: string;
        secondary: string;
        muted: string;
      };
      primary: {
        [key: string]: string;
      };
      secondary: {
        [key: string]: string;
      };
      gray: {
        [key: string]: string;
      };
      blue: {
        [key: string]: string;
      };
      border: string;
      success: string;
      warning: string;
      danger: string;
    };
    fontSizes: {
      [key: string]: string;
    };
    fontWeights: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    radii: {
      [key: string]: string;
    };
    spacing: {
      [key: string | number]: string;
    };
    shadows: {
      [key: string]: string;
    };
    breakpoints: {
      [key: string]: string;
    };
    transitions: {
      default: string;
      fast: string;
      slow: string;
    };
  }
}

export const theme = {
  colors: {
    background: "#f8f9fc",
    surface: "#ffffff",
    text: {
      primary: "#1a1b25",
      secondary: "#6b7280",
      muted: "#9ca3af",
    },
    primary: {
      50: "#eeeeff",
      100: "#e0e0ff",
      200: "#c0c0ff",
      300: "#9f9fff",
      400: "#7f7fff",
      500: "#4f4fff",
      600: "#3f3fcc",
      700: "#2f2f99",
      800: "#1f1f66",
      900: "#0f0f33",
    },
    secondary: {
      50: "#ffeeee",
      100: "#ffdddd",
      200: "#ffbbbb",
      300: "#ff9999",
      400: "#ff7777",
      500: "#ff5555",
      600: "#cc4444",
      700: "#993333",
      800: "#662222",
      900: "#331111",
    },
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712",
    },
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    border: "#e5e7eb",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  radii: {
    sm: "0.125rem",
    md: "0.25rem",
    lg: "0.5rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },
  spacing: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
    40: "10rem",
    48: "12rem",
    56: "14rem",
    64: "16rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    card: "0 4px 20px rgba(0, 0, 0, 0.06)",
    elevated: "0 10px 30px rgba(0, 0, 0, 0.08)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  transitions: {
    default: "0.3s ease",
    fast: "0.15s ease",
    slow: "0.5s ease",
  },
};
