import './App.css';
import { Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Home />} />
        <Route path='game' element={<Game />} />
      </Route>
    </Routes>
  );
}

export default App;
