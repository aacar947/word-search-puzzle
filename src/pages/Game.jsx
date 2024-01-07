import React from 'react';
import ModalContextProvider from '../contexts/ModalContextProvider';
import Gameboard from '../components/Gameboard';
import Modal from '../components/Modal';
import { useSearchParams } from 'react-router-dom';

const SIZE_VALIDATION_REGEX = /^[1-9]?[0-9]\*[1-9]?[0-9]$/s;
const DEFAULT_SIZE = [13, 15];
const MAX_SIZE = 20;

export default function Game() {
  const [params] = useSearchParams({ size: '13*15' });
  const getValidSize = () => {
    const _size = params.get('size').trim();
    if (!SIZE_VALIDATION_REGEX.test(_size)) return DEFAULT_SIZE;
    return _size.split('*').map((n) => {
      return Math.min(Number(n), MAX_SIZE);
    });
  };
  const size = getValidSize();
  console.log(size);
  return (
    <div className='App'>
      <ModalContextProvider>
        <Gameboard size={size} />
        <Modal />
      </ModalContextProvider>
    </div>
  );
}
