import "./App.css";
import SlackMessageBot from "./SlackBot";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <SlackMessageBot style={{ position: "absolute", top: 0 }} />
        <ToastContainer
          position="top-right"
          autoClose={1000}
          theme="dark"
        />
      </div>
    </div>
  );
}

export default App;
