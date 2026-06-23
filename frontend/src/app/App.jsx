import { BrowserRouter } from "react-router-dom";
import Footer from "@/shared/components/Footer";
import Header from "@/shared/components/Header";
import AppProviders from "./AppProviders";
import AppRouter from "./AppRouter";

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