import React, { useLayoutEffect, useState } from 'react';
import Highlight from './Highlight';

export default function Table({ size, table, tableRef, isMouseDown, selection, setSelection, debugMode }) {
  const [highlighter, setHighlighter] = useState(null);

  // mark selections
  useLayoutEffect(() => {
    if (selection.length === 0) {
      setHighlighter(null);
      return;
    }
    const start = selection[0].node;
    const end = selection[selection.length - 1].node;

    setHighlighter({ start, end });
  }, [selection]);

  const handleSelection = (node, value, x, y) => {
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
  };

  const handleCellRef = (ref, letter, x, y) => {
    tableRef.current[x + ',' + y] = { node: ref, value: letter, x, y };
  };

  const onSwipe = (node, value, x, y) => {
    if (!isMouseDown) return;
    handleSelection(node, value, x, y);
  };

  return (
    <>
      <div id='table-wrapper'>
        <table className='table'>
          <tbody>
            {table.map((row, i) => {
              return (
                <tr key={'tr' + i}>
                  {row.map((letter, j) => {
                    return (
                      <td
                        onMouseEnter={(e) => selection.length > 1 && onSwipe(e.currentTarget, letter, i, j)}
                        onMouseDown={(e) => handleSelection(e.currentTarget, letter, i, j)}
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
        {highlighter ? <Highlight className='selection' start={highlighter.start} end={highlighter.end} /> : null}
      </div>
    </>
  );
}
