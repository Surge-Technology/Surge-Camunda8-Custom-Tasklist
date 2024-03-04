import './App.css';
import Footer from './components/layout/Footer';
import Header from './components/layout/header';
import Login from './components/layout/Login';
import Sidebar from './components/layout/Sidebar';
import {BrowserRouter as Router ,Route, Routes} from "react-router-dom";
 import '@coreui/coreui/dist/css/coreui.min.css';
import Tasklist from './components/layout/Tasklist';

function App() {
  return (
    <Router>
    <div className="App">
    <Routes>
    <Route path="/process" element={<Header />} />
    <Route path="/sidebar" element={<Sidebar />} />
    <Route path="/footer" element={<Footer />} />
    <Route path="/tasklist" element={<Tasklist />} />
    <Route path="/" element={<Login />} />

    </Routes>
    </div>
    </Router>
  );
}

export default App;
