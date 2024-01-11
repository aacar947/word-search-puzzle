import './App.css';
import './Utility.css';
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Home from './pages/Home';
import Header from './components/Header';

const Game = lazy(() => import('./pages/Game'));

function App() {
  return (
    <>
      <div className='flex-col'>
        <Header />
        <main>
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
        </main>
      </div>
    </>
  );
}

export default App;
