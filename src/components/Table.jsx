import React, { useLayoutEffect, useState, useCallback, useRef, useMemo, useEffect } from 'react';
import Highlight from './Highlight';
import useEventListener from '../hooks/useEventListener';

export default function Table({ size, table, tableRef, wordlist, setWordlist, debugMode }) {
  const [selection, setSelection] = useState([]);
  const isMouseDown = useRef(false);
  const prevTouch = useRef();

  const handleSelection = useCallback(
    (node, value, x, y) => {
      if (selection.length === 0) {
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
          x = Math.max(Math.min(x0 + delta * xFactor, size[0] - 1), 0);
          y = Math.max(Math.min(y0 + delta * yFactor, size[1] - 1), 0);
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
      setSelection(_selection);
    },
    [selection, setSelection, size, tableRef]
  );

  const createTableRef = useCallback(
    (ref, letter, x, y) => {
      tableRef.current[x + ',' + y] = { node: ref, value: letter, x, y };
    },
    [tableRef]
  );

  const onSelectionEnd = () => {
    let word = '';
    selection.forEach((cell) => {
      word += cell.value;
    });
    const match = wordlist.find((w) => {
      return w.value.toLowerCase() === word.toLowerCase();
    });

    if (match) {
      match.found = true;
      setWordlist([...wordlist]);
    }
    if (selection.length > 0) setSelection([]);
  };

  const findAndHandleSelection = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!(el.matches('.cell') || el.matches('.letter'))) return;

    const cell = el.closest('.cell');
    console.log(el);

    if (el.matches('.cell') && selection.length === 1) return;

    const vector = cell.dataset.vector;
    const prev = prevTouch.current;

    if (vector === prev) return;
    prevTouch.current = vector;

    const value = cell.querySelector('p').innerText;
    const vectorArr = vector.split(',');

    handleSelection(cell, value, Number(vectorArr[0]), Number(vectorArr[1]));
  };

  const onTouchMove = (e) => {
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    findAndHandleSelection(x, y);
  };
  const onMouseMove = (e) => {
    if (!isMouseDown.current) return;
    const x = e.clientX;
    const y = e.clientY;
    findAndHandleSelection(x, y);
  };

  const onMouseDown = (e) => {
    isMouseDown.current = true;
    onMouseMove(e);
  };

  useEventListener('mouseleave', (e) => {
    if (!isMouseDown.current) return;
    onSelectionEnd();
    prevTouch.current = null;
    isMouseDown.current = false;
  });
  useEventListener('mousedown', (e) => {
    isMouseDown.current = true;
  });
  useEventListener('mouseup', (e) => {
    onSelectionEnd();
    prevTouch.current = null;
    isMouseDown.current = false;
  });
  useEventListener('touchend', (e) => {
    prevTouch.current = null;
    onSelectionEnd();
  });

  const wordSearchTable = useMemo(() => {
    return table.map((row, i) => {
      return (
        <tr key={'tr' + i}>
          {row.map((letter, j) => {
            return (
              <td
                data-vector={`${i},${j}`}
                className='cell'
                key={'td' + j}
                ref={(ref) => createTableRef(ref, letter, i, j)}
              >
                <p className={debugMode ? 'red-border letter' : 'letter'}>{letter}</p>
                {debugMode ? <div className='debug'>{i + ',' + j}</div> : null}
              </td>
            );
          })}
        </tr>
      );
    });
  }, [createTableRef, debugMode, table]);

  const selectionHighlight = useMemo(() => {
    return selection.length > 0 ? (
      <Highlight className='selection' start={selection[0].node} end={selection[selection.length - 1].node} />
    ) : null;
  }, [selection]);

  return (
    <div
      id='table-wrapper'
      onTouchMove={onTouchMove}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchMove}
      onMouseDown={onMouseDown}
    >
      <table className='table'>
        <tbody>{wordSearchTable}</tbody>
      </table>
      {selectionHighlight}
    </div>
  );
}
