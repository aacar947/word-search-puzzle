import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import Highlight from './Highlight';
import useEventListener from '../hooks/useEventListener';

export default function Table({ size, table, tableRef, wordlist, setWordlist, debugMode, windowSize }) {
  const [selection, setSelection] = useState([]);
  const isMouseDown = useRef(false);
  const prevInteraction = useRef();
  const mainRef = useRef();
  const boundary = useRef();

  useEffect(() => {
    const main = mainRef.current;
    const top = main.offsetTop;
    const left = main.offsetLeft;
    const bottom = top + main.offsetHeight;
    const right = left + main.offsetWidth;
    boundary.current = [top, left, bottom, right];
  }, [table, mainRef, windowSize]);

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

    if (el.matches('.cell') && selection.length === 1) return;

    const vector = cell.dataset.vector;
    const prev = prevInteraction.current;

    if (vector === prev) return;
    prevInteraction.current = vector;

    const value = cell.querySelector('p').innerText;
    const vectorArr = vector.split(',');

    handleSelection(cell, value, Number(vectorArr[0]), Number(vectorArr[1]));
  };

  const clampBetweenBoundary = (x, y) => {
    const margin = 10;
    x = Math.max(Math.min(x, boundary.current[3] - margin), boundary.current[1] + margin);
    y = Math.max(Math.min(y, boundary.current[2] - margin), boundary.current[0] + margin);
    return [x, y];
  };

  const onTouchMove = (e) => {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    [x, y] = clampBetweenBoundary(x, y);
    findAndHandleSelection(x, y);
  };

  const onTouchStart = (e) => {
    onTouchMove(e);
  };

  const onMouseMove = (e) => {
    if (!isMouseDown.current) return;
    let x = e.clientX;
    let y = e.clientY;
    [x, y] = clampBetweenBoundary(x, y);
    findAndHandleSelection(x, y);
  };

  const onMouseDown = (e) => {
    isMouseDown.current = true;
    onMouseMove(e);
  };
  // Global events>
  useEventListener('mouseleave', () => {
    if (!isMouseDown.current) return;
    onSelectionEnd();
    prevInteraction.current = null;
    isMouseDown.current = false;
  });
  useEventListener('mousedown', () => {
    isMouseDown.current = true;
  });
  useEventListener('mouseup', () => {
    onSelectionEnd();
    prevInteraction.current = null;
    isMouseDown.current = false;
  });
  useEventListener('touchend', () => {
    prevInteraction.current = null;
    onSelectionEnd();
  });
  useEventListener('mousemove', onMouseMove);

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
    <div id='table-wrapper' {...{ onTouchMove, onTouchStart, onMouseDown }}>
      <table className='table' ref={mainRef}>
        <tbody>{wordSearchTable}</tbody>
      </table>
      {selectionHighlight}
    </div>
  );
}
