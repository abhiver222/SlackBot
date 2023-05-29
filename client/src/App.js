import "./App.css";
import SlackMessageBot from "./SlackBot";
import Typography from "@mui/material/Typography";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <SlackMessageBot style={{ position: "absolute", top: 0 }} />
        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          pauseOnHover
          theme="dark"
        />
      </div>
    </div>
  );
}

export default App;
