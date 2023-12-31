import React from 'react';

function WordList({ wordlist = [] }) {
  return (
    <div className='wordlist'>
      {wordlist.map((word, i) => {
        return (
          <p key={i} className={word.found ? 'found' : ''}>
            {word.value}
          </p>
        );
      })}
    </div>
  );
}

export default WordList;
