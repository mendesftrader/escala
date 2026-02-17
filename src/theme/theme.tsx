import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3d4853" },
    secondary: { main: "#dc004e" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;

