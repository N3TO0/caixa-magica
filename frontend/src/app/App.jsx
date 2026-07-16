import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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

        <ToastContainer
          autoClose={4000}
          closeOnClick
          draggable
          newestOnTop
          pauseOnFocusLoss
          pauseOnHover
          position="top-right"
          theme="colored"
        />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
