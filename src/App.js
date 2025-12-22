import RoutesApp from "./routes/routes";
import { ToastContainer, Slide } from "react-toastify";
import './global.css'

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer 
        autoClose="2000"
        closeOnClick
        transition={Slide}
        className="alertNotification"
      />
      <RoutesApp />
    </div>
  );
}

export default App;