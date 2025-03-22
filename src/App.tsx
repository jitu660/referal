import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/Dashboard";
import ReferPage from "./pages/ReferPage";
import { GlobalStyles } from "./styles/GlobalStyles";
import { ThemeProvider } from "./styles/ThemeProvider";
import styled from "@emotion/styled";
import { Network } from "lucide-react";

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    max-width: 480px; // Same constrained width as card on larger screens
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.blue[500]};
`;

const LogoIcon = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <GlobalStyles />
        <AppContainer>
          <Header>
            <HeaderContent>
              <Logo>
                <LogoIcon>
                  <Network size={24} />
                </LogoIcon>
                Refernet
              </Logo>
            </HeaderContent>
          </Header>
          <MainContent>
            <Routes>
              <Route path="/" element={<DashBoard userId={"97fffc35b648278c"} />} />
              <Route path="/refer" element={<ReferPage />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </BrowserRouter>
    </ThemeProvider>
  );
}
