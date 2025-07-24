
import './App.css';
import './index.css'; // ou './main.css'
import Home from './Home';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
      </Routes>
    </Router>
  );


}

export default App;
