import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppRoutes from "./routes/AppRoutes";

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
