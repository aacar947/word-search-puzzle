import './App.css';
import Gameboard from './components/Gameboard';
import ModalContextProvider from './contexts/ModalContextProvider';
import Modal from './components/Modal';
function App() {
  return (
    <div className='App'>
      <ModalContextProvider>
        <Gameboard />
        <Modal />
      </ModalContextProvider>
    </div>
  );
}

export default App;
