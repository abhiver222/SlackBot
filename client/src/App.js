import './App.css';
import SlackMessageBot from './SlackBot';
import Typography from '@mui/material/Typography';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <div className="App">
      <div className="App-header">
        <Typography variant='h2' style={{position: "absolute", top: "5%"}}>SlackBot</Typography>
        <SlackMessageBot style={{position: "absolute",top:0}}/>
        <ToastContainer position='bottom-center' autoClose={1000} pauseOnHover theme="dark"/>
      </div>
      
    </div>
  );
}

export default App;
