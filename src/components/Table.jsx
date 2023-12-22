import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import createPuzzle from '../utils/createPuzzle';
import WordList from './WordList';
import { getByDisplayValue } from '@testing-library/react';

export default function Table() {
  const [mouseDown, setMouseDown] = useState(false);
  const [selection, setSelection] = useState([]);
  const [table, setTable] = useState([]);
  const [wordlist, setWordlist] = useState([]);
  const tableRef = useRef({});

  useLayoutEffect(() => {
    const [_table, _wordlist] = createPuzzle(14, 20);
    setTable(_table);
    setWordlist(
      _wordlist.map((word) => {
        return { value: word, found: false };
      })
    );
  }, []);

  // mark selections
  useEffect(() => {
    selection.forEach((cell) => {
      cell.node.classList.add('selected');
    });
  }, [selection]);

  const markAsFound = () => {
    selection.forEach((cell) => {
      cell.node.classList.add('found');
    });
  };

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

  const onMouseLeave = (e) => {
    if (mouseDown) setMouseDown(false);
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

  const handleSelection = (node, value, x, y) => {
    if (selection.length === 0) {
      setSelection([{ node, value, x, y }]);
      return;
    }

    const _selection = [];
    const x0 = selection[0].x;
    const y0 = selection[0].y;

    if (!(x0 === x || y0 === y || Math.abs(x0 - x) === Math.abs(y0 - y))) return;

    const length = x === x0 ? Math.abs(y - y0) : Math.abs(x - x0);
    for (let i = 0; i <= length; i++) {
      const xFactor = x0 === x ? 0 : (x - x0) / Math.abs(x - x0);
      const yFactor = y0 === y ? 0 : (y - y0) / Math.abs(y - y0);
      const _x = x0 + i * xFactor;
      const _y = y0 + i * yFactor;
      const cell = tableRef.current[_x + ',' + _y];
      _selection.push(cell);
    }

    clearSelectionMark(0);
    setSelection(_selection);
  };

  const handleCellRef = (ref, letter, x, y) => {
    tableRef.current[x + ',' + y] = { node: ref, value: letter, x, y };
  };

  const onSwipe = (e, value, x, y) => {
    if (!mouseDown) return;
    handleSelection(e.target.offsetParent, value, x, y);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', padding: '1rem' }}>
      <table onMouseLeave={onMouseLeave} onMouseDown={onMouseDown} onMouseUp={onMouseUp} className='table'>
        <tbody>
          {table.map((row, i) => {
            return (
              <tr key={'tr' + i}>
                {row.map((letter, j) => {
                  return (
                    <td key={'td' + j} ref={(ref) => handleCellRef(ref, letter, i, j)}>
                      <div
                        onMouseEnter={(e) => onSwipe(e, letter, i, j)}
                        onMouseDown={(e) => handleSelection(e.target.offsetParent, letter, i, j)}
                      >
                        {letter}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <WordList wordlist={wordlist}></WordList>
    </div>
  );
}
