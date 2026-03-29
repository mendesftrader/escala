import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#585a5c" },
    secondary: { main: "#dc004e" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;

