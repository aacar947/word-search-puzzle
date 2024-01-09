import React, { useCallback, useEffect } from 'react';
import ModalContextProvider from '../contexts/ModalContextProvider';
import Gameboard from '../components/Gameboard';
import Modal from '../components/Modal';
import { useSearchParams } from 'react-router-dom';

const SIZE_VALIDATION_REGEX = /^[1-2]?[0-9]\*[1-2]?[0-9]$/s;
const DEFAULT_SIZE = [13, 15];

export default function Game() {
  const [query, setQuery] = useSearchParams({ size: '13*15' });

  const getValidSize = useCallback(() => {
    const _size = query.get('size')?.trim();
    return !_size || !SIZE_VALIDATION_REGEX.test(_size) ? DEFAULT_SIZE.join('*') : _size;
  }, [query]);

  useEffect(() => {
    setQuery(
      (prev) => {
        return { ...prev, size: getValidSize() };
      },
      { replace: true }
    );
  }, [getValidSize, setQuery]);

  const size = getValidSize().split('*');
  return (
    <div className='App'>
      <ModalContextProvider>
        <Gameboard size={size} />
        <Modal />
      </ModalContextProvider>
    </div>
  );
}
