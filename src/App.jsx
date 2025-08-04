
import './App.css';
import './index.css'; // ou './main.css'
import Home from './pages/Home';
import Login from './pages/Login';
import PageCadastro from './pages/PageCadastro'
import ProtectPage from './pages/ProtectPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/home' element={<ProtectPage> <Home/> </ProtectPage>}></Route>
        <Route path="/cadastro" element={<PageCadastro/>}></Route>
      </Routes>
    </Router>
  );


}

export default App;
