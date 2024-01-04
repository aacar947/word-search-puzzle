import React, { useState, useLayoutEffect, useRef, useMemo } from 'react';
import Table from './Table';
import createPuzzle from '../utils/createPuzzle';
import WordList from './WordList';
import Timer from './Timer';
import Highlight from './Highlight';
import useEventListener from '../hooks/useEventListener';

export default function Gameboard({ size = [13, 15] }) {
  const [debugMode] = useState(false);
  const [table, setTable] = useState([]);
  const [wordlist, setWordlist] = useState([]);
  const tableRef = useRef({});
  const WordHighlighterRef = useRef([]);

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
    <div id='gameboard' style={{ position: 'relative' }}>
      <div id='gameboard-center'>
        <Timer wordlist={wordlist} />
        <Table
          {...{
            table,
            tableRef,
            debugMode,
            size,
            wordlist,
            setWordlist,
            windowSize,
          }}
        />
        <WordList wordlist={wordlist}></WordList>
        {highlightedWords}
      </div>
    </div>
  );
}
