import React, { useState, useLayoutEffect, useRef } from 'react';
import Table from './Table';
import createPuzzle from '../utils/createPuzzle';
import WordList from './WordList';
import Highlight from './Highlight';
import useEventListener from '../hooks/useEventListener';

export default function Gameboard({ size = [13, 15] }) {
  const [debugMode] = useState(false);
  const [table, setTable] = useState([]);
  const [selection, setSelection] = useState([]);
  const [wordlist, setWordlist] = useState([]);
  const isMouseDown = useRef(false);
  const tableRef = useRef({});
  const highlighterRef = useRef([]);

  const [windowSize, setWindowSize] = useState();

  useEventListener('resize', (e) => {
    setWindowSize([e.target.innerHeight, e.target.innerWidth]);
  });

  useLayoutEffect(() => {
    const [_table, _wordlist] = createPuzzle(size[0], size[1], 40);
    setTable(_table);
    setWordlist(_wordlist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // mark found word(s)
  useLayoutEffect(() => {
    highlighterRef.current = wordlist.map((w) => {
      const startCell = tableRef.current[w.start[0] + ',' + w.start[1]].node;
      const endCell = tableRef.current[w.end[0] + ',' + w.end[1]].node;
      return { start: startCell, end: endCell };
    });
  }, [wordlist]);

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
    }
    if (!isMouseDown.current) setSelection([]);
  };

  const onMouseLeave = (e) => {
    if (isMouseDown.current) {
      onSelectionEnd();
      isMouseDown.current = false;
    }
  };
  const onMouseDown = (e) => {
    isMouseDown.current = true;
  };
  const onMouseUp = (e) => {
    isMouseDown.current = false;
    onSelectionEnd();
  };

  const onTouchEnd = () => {
    onSelectionEnd();
  };

  const highlightedWords = wordlist.map((w, i) => {
    if (!(debugMode || w.found)) return null;
    const mark = highlighterRef.current[i];
    return mark ? (
      <Highlight key={'hg' + i} start={mark.start} end={mark.end} windowSize={windowSize}></Highlight>
    ) : null;
  });

  return (
    <div id='gameboard' style={{ position: 'relative' }} {...{ onMouseDown, onMouseUp, onMouseLeave, onTouchEnd }}>
      <div id='gameboard-center'>
        <Table
          {...{
            table,
            tableRef,
            debugMode,
            size,
            selection,
            setSelection,
            setWordlist,
            isMouseDown,
          }}
        />
        <WordList wordlist={wordlist}></WordList>
        {highlightedWords}
      </div>
    </div>
  );
}
