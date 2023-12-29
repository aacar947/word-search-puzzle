import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import createPuzzle from '../utils/createPuzzle';
import WordList from './WordList';

export default function Table() {
  const [mouseDown, setMouseDown] = useState(false);
  const [selection, setSelection] = useState([]);
  const [table, setTable] = useState([]);
  const [debugMode, setDebugMode] = useState(false);
  const [wordlist, setWordlist] = useState([]);
  const tableRef = useRef({});
  const [size, setSize] = useState({ h: 13, w: 15 });

  useLayoutEffect(() => {
    const [_table, _wordlist] = createPuzzle(size.h, size.w, 40);
    setTable(_table);
    setWordlist(_wordlist);
  }, [size]);

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
      console.log(node);
      setSelection([{ node, value, x, y }]);
      return;
    }

    const _selection = [];
    const x0 = selection[0].x;
    const y0 = selection[0].y;
    const isValid = () => x0 === x || y0 === y || Math.abs(x0 - x) === Math.abs(y0 - y);

    if (selection.length > 1 && !isValid()) {
      const x1 = selection[1].x;
      const y1 = selection[1].y;
      if (x0 === x1) {
        x = x0;
      } else if (y0 === y1) {
        y = y0;
      } else {
        const delta = Math.max(Math.abs(x0 - x), Math.abs(y0 - y));
        const xFactor = x1 - x0;
        const yFactor = y1 - y0;
        x = Math.max(Math.min(x0 + delta * xFactor, size.h - 1), 0);
        y = Math.max(Math.min(y0 + delta * yFactor, size.w - 1), 0);
        console.log(x, y);
      }
    }

    if (!isValid()) return;

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

  const onSwipe = (node, value, x, y) => {
    if (!mouseDown) return;
    handleSelection(node, value, x, y);
  };

  return (
    <>
      <div id='table-wrapper'>
        <table onMouseLeave={onMouseLeave} onMouseDown={onMouseDown} onMouseUp={onMouseUp} className='table'>
          <tbody>
            {table.map((row, i) => {
              return (
                <tr key={'tr' + i}>
                  {row.map((letter, j) => {
                    return (
                      <td
                        onMouseEnter={(e) => selection.length > 1 && onSwipe(e.currentTarget, letter, i, j)}
                        onMouseDown={(e) => handleSelection(e.currentTarget, letter, i, j)}
                        className={letter === letter.toLowerCase() && debugMode ? 'word-letter' : null}
                        key={'td' + j}
                        ref={(ref) => handleCellRef(ref, letter, i, j)}
                      >
                        <p
                          className={debugMode ? 'red-border' : null}
                          onMouseDown={(e) => handleSelection(e.currentTarget.offsetParent, letter, i, j)}
                          onMouseEnter={(e) =>
                            selection.length <= 1 && onSwipe(e.currentTarget.offsetParent, letter, i, j)
                          }
                        >
                          {letter}
                        </p>
                        {debugMode ? <div className='debug'>{i + ',' + j}</div> : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <WordList wordlist={wordlist}></WordList>
    </>
  );
}
