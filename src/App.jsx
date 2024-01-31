import { createTheme ,responsiveFontSizes} from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import Chat from "./pages/Chat"
import Landing from "./pages/Landing";
import { purple,amber } from '@mui/material/colors';
function App() {
 
  let theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#6200EE",
      },
      secondary: {
        main: '#ffc400',
      },
      
    },
  });
  // theme.typography.h3 = {
  //   fontSize: '1.8rem',
  //   '@media (min-width:600px)': {
  //     fontSize: '1.5rem',
  //   },
  //   [theme.breakpoints.up('md')]: {
  //     fontSize: '2.5rem',
  //   },
  // };
  theme = responsiveFontSizes(theme);
  return (
    
    <ThemeProvider theme={theme}>
      <Landing/>
   
    </ThemeProvider>
  )
}

export default App
