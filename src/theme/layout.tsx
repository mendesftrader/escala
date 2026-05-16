//LAYOUTE LOCAL NECESSITA SER IMPORTADO

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#585a5c" },
    secondary: { main: "#e7eb15" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;

