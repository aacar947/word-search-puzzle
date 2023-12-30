import React, { useState, useLayoutEffect } from 'react';
import Table from './Table';
import createPuzzle from '../utils/createPuzzle';

export default function Gameboard({ size = { h: 13, w: 15 } }) {
  const [table, setTable] = useState([]);
  const [selection, setSelection] = useState([]);
  const [wordlist, setWordlist] = useState([]);
  const [isMouseDown, setMouseDown] = useState(false);

  useLayoutEffect(() => {
    const [_table, _wordlist] = createPuzzle(size.h, size.w, 40);
    setTable(_table);
    setWordlist(_wordlist);
  }, []);

  const onSelectionEnd = () => {
    let word = '';
    selection.forEach((cell) => {
      word += cell.value;
    });
    const match = wordlist.find((w) => {
      return w.value === word;
    });

    if (match) {
      match.found = true;
      setWordlist([...wordlist]);
      markAsFound();
    }
    clearSelectionMark(0);
    setSelection([]);
  };

  const clearSelectionMark = (start = 0) => {
    selection.forEach((cell, i) => {
      if (i >= start) {
        cell.node.classList.remove('selected');
      }
    });
  };

  const markAsFound = () => {
    selection.forEach((cell) => {
      cell.node.classList.add('found');
    });
  };

  const onMouseLeave = (e) => {
    if (isMouseDown) setMouseDown(false);
    clearSelectionMark();
    onSelectionEnd();
  };
  const onMouseDown = (e) => {
    setMouseDown(true);
  };
  const onMouseUp = (e) => {
    setMouseDown(false);
    clearSelectionMark();
    onSelectionEnd();
  };

  return (
    <div id='gameboard' {...{ onMouseDown, onMouseUp, onMouseLeave }}>
      <div id='gameboard-center'>
        <Table {...{ table, size, selection, setSelection, wordlist, setWordlist, isMouseDown, clearSelectionMark }} />
      </div>
    </div>
  );
}
