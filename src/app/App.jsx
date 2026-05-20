import { BrowserRouter } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AppProviders from "./providers";
import AppRouter from "./router";

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Header />

        <main className="app-main">
          <AppRouter />
        </main>

        <Footer />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
