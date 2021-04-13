import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { calculateWinnerModified } from './helpers';

const Square = ({ value, onClick }) => <button className="square" onClick={onClick}>{value}</button>;

class GameSettings extends React.Component {
  render () {
    const { inputRef, squareSize, onClick } = this.props;
    return (
      <>
        <span>Enter board size: </span>
        <input type="number" defaultValue={squareSize} ref={inputRef} min="3" max="20" />
        <button onClick={onClick}>Restart</button>
      </>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    const { squares, onClick } = this.props;
    return <Square key={i} value={squares[i]} onClick={() => onClick(i)} />;
  }

  renderBoardRow(squareSize, rowNumber) {
    return (
      <div key={rowNumber} className="board-row">
        {[...Array(squareSize).keys()].map(el => this.renderSquare(el + rowNumber))}
      </div>
    );
  }

  render() {
    const { squareSize } = this.props;
    return <>{[...Array(squareSize).keys()].map(el => this.renderBoardRow(squareSize, el * squareSize))}</>;
  }
}

const getInitialState = (squareSize) => ({
  squareSize,
  history: [{
    squares: Array(squareSize * squareSize).fill(null),
  }],
  stepNumber: 0,
  xIsNext: true
});

class Game extends React.Component {
  constructor(props) {
    super(props);

    const squareSize = 3;
    this.state = getInitialState(squareSize);
    this.squareSizeInput = React.createRef();
  }

  handleGameSettingsClick = () => {
    let squareSize = +this.squareSizeInput.current.value;
    this.setState(getInitialState(squareSize));
  }

  handleBoardClick = (i) => {
    const { history, stepNumber, squareSize } = this.state;
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinnerModified(squares, squareSize) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: newHistory.concat([{ squares }]),
      stepNumber: newHistory.length,
      xIsNext: !this.state.xIsNext
    });
  }

  handleJumpToClick(stepNumber) {
    this.setState({
      stepNumber,
      xIsNext: (stepNumber % 2) === 0
    });
  }

  render() {
    const {
      squareSize,
      stepNumber,
      xIsNext,
      history
    } = this.state;

    const current = history[stepNumber];
    const winner = calculateWinnerModified(current.squares, squareSize);
    const nextFlag = xIsNext ? 'X' : 'O';
    const status = winner ? `Winner: ${winner}` : `Next player: ${nextFlag}`
    const moves = history.map((_, stepNumber) => (
      <li key={stepNumber}>
        <button className={winner && stepNumber === history.length - 1 ? 'green-btn' : ''} onClick={() => this.handleJumpToClick(stepNumber)}>
          {stepNumber ? `Go to move #${stepNumber}` : 'Go to game start'}
        </button>
      </li>
    ));

    return (
      <div className="game">
        <div className="game-settings">
          <GameSettings inputRef={this.squareSizeInput} squareSize={squareSize} onClick={this.handleGameSettingsClick} />
        </div>
        <div className="game-board">
          <Board squareSize={squareSize} squares={current.squares} onClick={this.handleBoardClick} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById('root'));
