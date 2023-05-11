import RoutesApp from './routes'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
  <>
  <ToastContainer autoClose = {4000}/>
  <RoutesApp/>
  </>
  
  );
}

export default App;
