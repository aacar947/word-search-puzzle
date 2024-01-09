import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { lazy, Suspense } from 'react';

const Game = lazy(() => import('./pages/Game'));

function App() {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Home />} />
        <Route
          path='game'
          element={
            <Suspense>
              <Game />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
