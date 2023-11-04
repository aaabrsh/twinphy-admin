import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from "./routes/Routes";

function App() {
  return (
    <>
      <Router />
      <ToastContainer />
    </>
  );
}

export default App;
