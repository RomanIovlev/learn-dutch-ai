/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dutch flag colors using CSS variables
        dutch: {
          red: "var(--dutch-red)",
          white: "var(--dutch-white)",
          blue: "var(--dutch-blue)",
        },
        // Custom brand colors using CSS variables
        brand: {
          50: "var(--blue-50)",
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          300: "var(--blue-300)",
          400: "var(--blue-400)",
          500: "var(--blue-500)",
          600: "var(--blue-600)",
          700: "var(--blue-700)",
          800: "var(--blue-800)",
          900: "var(--blue-900)",
        },
        // Learning progress colors using CSS variables
        progress: {
          new: "var(--gray-500)",
          weak: "var(--red-500)",
          learning: "var(--yellow-500)",
          strong: "var(--green-500)",
          known: "var(--green-600)",
        },
        // Extended color palette using CSS variables
        primary: "var(--blue-500)",
        secondary: "var(--gray-500)",
        success: "var(--green-500)",
        danger: "var(--red-500)",
        warning: "var(--yellow-500)",
        info: "var(--blue-500)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-subtle": "bounceSubtle 2s infinite",
        "pulse-blue": "pulseBlue 2s infinite",
        "flip-card": "flipCard 0.6s ease-in-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceSubtle: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-3px)" },
          "60%": { transform: "translateY(-2px)" },
        },
        pulseBlue: {
          "0%": { boxShadow: "0 0 0 0 var(--shadow-blue-glow)" },
          "70%": { boxShadow: "0 0 0 10px var(--shadow-blue-transparent)" },
          "100%": { boxShadow: "0 0 0 0 var(--shadow-blue-transparent)" },
        },
        flipCard: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      boxShadow: {
        glow: "0 0 20px var(--shadow-blue)",
        "glow-green": "0 0 20px var(--shadow-green)",
        "glow-red": "0 0 20px var(--shadow-red)",
        "glow-orange": "0 0 20px var(--shadow-orange)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "dutch-flag":
          "linear-gradient(to bottom, var(--dutch-red) 33.33%, var(--dutch-white) 33.33%, var(--dutch-white) 66.66%, var(--dutch-blue) 66.66%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      perspective: {
        1000: "1000px",
        2000: "2000px",
      },
      rotate: {
        "y-180": "rotateY(180deg)",
      },
    },
  },
  plugins: [
    // Custom plugin for 3D transforms and perspective
    function ({ addUtilities }) {
      const newUtilities = {
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".perspective-2000": {
          perspective: "2000px",
        },
        ".transform-style-preserve-3d": {
          transformStyle: "preserve-3d",
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
        ".rotate-y-0": {
          transform: "rotateY(0deg)",
        },
        // Text gradient utilities
        ".text-gradient": {
          background:
            "linear-gradient(to right, var(--blue-600), var(--indigo-600))",
          "-webkit-background-clip": "text",
          "background-clip": "text",
          color: "transparent",
        },
        ".text-gradient-orange": {
          background:
            "linear-gradient(to right, var(--orange-500), var(--red-500))",
          "-webkit-background-clip": "text",
          "background-clip": "text",
          color: "transparent",
        },
        ".text-gradient-dutch": {
          background:
            "linear-gradient(to right, var(--dutch-red), var(--dutch-blue))",
          "-webkit-background-clip": "text",
          "background-clip": "text",
          color: "transparent",
        },
        // Glass morphism
        ".glass": {
          backdropFilter: "blur(16px)",
          backgroundColor: "var(--white-30)",
          border: "1px solid var(--white-20)",
        },
        ".glass-dark": {
          backdropFilter: "blur(16px)",
          backgroundColor: "var(--black-30)",
          border: "1px solid var(--white-10)",
        },
        // Custom scrollbar
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "var(--gray-400) var(--gray-100)",
        },
        ".scrollbar-none": {
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
        },
        ".scrollbar-none::-webkit-scrollbar": {
          display: "none",
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
