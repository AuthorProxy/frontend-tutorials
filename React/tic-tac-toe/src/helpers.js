export const calculateWinner = (squares, squareSize) => {
  if (squareSize !== 3) {
    throw Error('Board size should equals 3 for this method');
  }

  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winLines.length; i++) {
    const [a, b, c] = winLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

export const calculateWinnerModified = (squares, squareSize) => {
  const isRowMarkedByVertical = (elPos, iteration = 0) => {
    if (iteration === squareSize - 1) {
      return squares[elPos];
    }

    if (squares[elPos] === isRowMarkedByVertical(elPos + squareSize, iteration + 1)) {
      return squares[elPos];
    }

    return null;
  };

  const isRowMarkedByHorizontal = (elPos, iteration = 0) => {
    if (iteration === squareSize - 1) {
      return squares[elPos];
    }

    if (squares[elPos] === isRowMarkedByHorizontal(elPos + 1, iteration + 1)) {
      return squares[elPos];
    }

    return null;
  };

  const isRowMarkedByDiagonalTopLeftToDownRight = (elPos, iteration = 0) => {
    if (iteration === squareSize - 1) {
      return squares[elPos];
    }

    if (squares[elPos] === isRowMarkedByDiagonalTopLeftToDownRight(elPos + squareSize + 1, iteration + 1)) {
      return squares[elPos];
    }

    return null;
  };

  const isRowMarkedByDiagonalDownLeftToTopRight = (elPos, iteration = 0) => {
    if (iteration === squareSize - 1) {
      return squares[elPos];
    }

    if (squares[elPos] === isRowMarkedByDiagonalDownLeftToTopRight(elPos - squareSize + 1, iteration + 1)) {
      return squares[elPos];
    }

    return null;
  };

  if (isRowMarkedByDiagonalTopLeftToDownRight(0)) {
    return squares[0];
  }

  for (let x = 0; x < squareSize; x++) {
    if (isRowMarkedByVertical(x)) {
      return squares[x];
    }
  }

  const downLeftIndex = squareSize * squareSize - squareSize;
  if (isRowMarkedByDiagonalDownLeftToTopRight(downLeftIndex)) {
    return squares[downLeftIndex];
  }

  for (let y = 0; y <= downLeftIndex; y += squareSize) {
    if (isRowMarkedByHorizontal(y)) {
      return squares[y];
    }
  }

  return null;
}

export default calculateWinnerModified;
