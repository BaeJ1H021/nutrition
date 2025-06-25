import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import { BoldText } from './components/atoms';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BoldText size={28} color="black">
        Hello, World!
      </BoldText>
    </ThemeProvider>
  );
}

export default App;
