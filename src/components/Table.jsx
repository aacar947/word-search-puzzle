import React, { useState, useCallback, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import Highlight from './Highlight';
import useEventListener from '../hooks/useEventListener';
import { clamp } from '../utils/helperFunctions';

export default function Table({ size, table, wordlist, setWordlist, debugMode, windowSize, gameOver }) {
  const [selection, setSelection] = useState([]);
  const tableRef = useRef({});
  const WordHighlighterRef = useRef([]);
  const isMouseDown = useRef(false);
  const prevInteraction = useRef();
  const mainRef = useRef();
  const boundary = useRef();

  useEffect(() => {
    const rect = mainRef.current.getBoundingClientRect();
    boundary.current = [rect.top, rect.left, rect.bottom, rect.right];
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
          x = clamp(x0 + delta * xFactor, 0, size[1] - 1);
          y = clamp(y0 + delta * yFactor, 0, size[0] - 1);
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
    if (selection.length === 0) return;
    let word = '';
    selection.forEach((cell) => {
      word += cell.value;
    });
    const match = wordlist.find((w) => {
      return w.value.toLowerCase() === word.toLowerCase();
    });

    if (match && !match.found) {
      match.found = true;
      match.foundAt = Date.now();
      setWordlist([...wordlist]);
    }
    setSelection([]);
  };

  const clampBetweenBoundary = (x, y) => {
    const margin = 5;
    x = Math.max(Math.min(x, boundary.current[3] - margin), boundary.current[1] + margin);
    y = Math.max(Math.min(y, boundary.current[2] - margin), boundary.current[0] + margin);
    return [x, y];
  };

  const findAndHandleSelection = (input) => {
    if (gameOver.current) return;
    let x = input.clientX;
    let y = input.clientY;
    [x, y] = clampBetweenBoundary(x, y);
    const el = document.elementFromPoint(x, y);

    if (!el || !(el.matches('.cell') || el.matches('.letter'))) return;

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

  const onTouchMove = (e) => {
    findAndHandleSelection(e.touches[0]);
  };

  const onTouchStart = (e) => {
    onTouchMove(e);
  };

  const onMouseMove = (e) => {
    if (!isMouseDown.current) return;
    findAndHandleSelection(e);
  };

  const onMouseDown = (e) => {
    isMouseDown.current = true;
    findAndHandleSelection(e);
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

  // mark found word(s)
  useLayoutEffect(() => {
    WordHighlighterRef.current = wordlist.map((w) => {
      const startCell = tableRef.current[w.start[0] + ',' + w.start[1]].node;
      const endCell = tableRef.current[w.end[0] + ',' + w.end[1]].node;
      return { start: startCell, end: endCell };
    });
  }, [wordlist]);

  const highlightedWords = useMemo(() => {
    return wordlist.map((w, i) => {
      if (!(debugMode || w.found)) return null;
      const mark = WordHighlighterRef.current[i];
      return mark ? (
        <Highlight key={'hg' + i} start={mark.start} end={mark.end} windowSize={windowSize}></Highlight>
      ) : null;
    });
  }, [debugMode, windowSize, wordlist]);

  return (
    <div id='table-wrapper' className='round-corner box-shadow' {...{ onTouchMove, onTouchStart, onMouseDown }}>
      <table className='table touch-action-none' ref={mainRef}>
        <tbody>{wordSearchTable}</tbody>
      </table>
      {selectionHighlight}
      {highlightedWords}
    </div>
  );
}
