import Wordlist from './wordlist';
const MAX_SIZE = 40
export default function createPuzzle(size = 11, wordCount = 4) {
  size = Math.min(MAX_SIZE, size);
  const maxChar = size - 3
  const listSize = Math.min(size, wordCount)
  // create word list
  const wordlist = createAWordList(listSize, maxChar)
  // create empty table matrix
  const table = createTableArray(size);
  // place words
  placeWords(table, wordlist, size)
  // fill empty cells with random letters
  fillEmptyCells(table)
  return [table, wordlist];
}

function createAWordList(size, maxChar) {
  let wordlist = [];
  const _wordlist = Wordlist.filter(w => w.length <= maxChar);
  const length = _wordlist.length;
  const pickedIndexes = [];
  for (let i = 0; i < size; i++) {
    // pick random words
    let index;
    let picked = false
    // avoid duplication
    do {
      index = randomInt(length)
      picked = pickedIndexes.includes(index);
    } while (picked)
    wordlist.push(_wordlist[index])
    pickedIndexes.push(index)

  }
  return wordlist;
}

function createTableArray(size) {
  const table = new Array(size).fill(0).map(() => {
    return new Array(size).fill(0)
  })

  return table
}



function placeWords(table, wordlist, size) {
  const directions = [
    { name: "hor", x: 0, y: 1, check: (l, x, y) => y < (size - l) },
    { name: "ver", x: 1, y: 0, check: (l, x, y) => x < (size - l) },
    { name: "diag", x: -1, y: 1, check: (l, x, y) => x > l && y < (size - l) },
    { name: "diag-", x: 1, y: 1, check: (l, x, y) => x < (size - l) && y < (size - l) }];

  for (let i = 0; i < wordlist.length; i++) {
    const word = wordlist[i];
    let cell, dir;
    let occupied = false
    const openset = getOpenset(size, word.length);

    do {
      if (openset.length <= 0) {
        wordlist.splice(i, 1)
        i--;
        break;
      }
      const cellIndex = randomInt(openset.length)
      cell = openset[cellIndex]

      const dirIndex = randomInt(directions.length);

      for (let _j = 0; _j < directions.length; _j++) {
        const j = (_j + dirIndex) % directions.length
        dir = directions[j]
        occupied = checkOccupation(table, word, dir, cell.x, cell.y)
        if (occupied) {
          continue;
        } else break;
      }
      if (occupied) {
        openset.splice(cellIndex, 1)
      }
    } while (occupied);

    if (!occupied) placeWord(table, cell, word, dir)
  }
}

function placeWord(table, cell, word, dir) {
  let x = cell.x;
  let y = cell.y;
  for (const char of word) {
    table[x][y] = char;
    x += dir.x;
    y += dir.y
  }
}

function checkOccupation(table, word, dir, x, y) {
  let occupied = false;
  if (!dir.check(word.length, x, y)) return true;
  for (const char of word) {
    occupied = (table[x][y] != 0)
    if (occupied) break;
    x += dir.x;
    y += dir.y
  }
  return occupied;
}

function getOpenset(size, l) {
  const openset = [];
  const max = size - l
  for (let i = 0; i < size * size; i++) {
    const x = Math.floor(i / size)
    const y = Math.floor(i % size)
    if (x > max && y > max) continue;
    openset.push({ x, y })
  }
  return openset;
}

function fillEmptyCells(table) {
  table.map((row, x) => {
    row.map((cell, y) => {
      if (!cell) table[x][y] = String.fromCharCode(randomInt(65, 91))
    })
  })
}

function randomInt(number) {
  let min = 0, max = number;
  if (arguments.length >= 2) {
    min = arguments[0];
    max = arguments[1];
  }
  return Math.floor(Math.random() * (max - min) + min);
}

