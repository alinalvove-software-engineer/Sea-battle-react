import React, { useState, useEffect } from 'react';
import Board from './Board';
import generateShips from '../components/utils/generateShips';

const Game = () => {
  const [playerBoard, setPlayerBoard] = useState(Array(100).fill('empty')); //создаёт state-переменную playerBoard и функцию setPlayerBoard для её изм; Array(100).fill('empty') — массив длины 100, все элементы 'empty', ипс дестуктуризацию, получаем playerBoard и setPlayerBoard
  const [playerShips] = useState(() =>       //
    generateShips().map(shipPositions => ({
      positions: Array.isArray(shipPositions) ? shipPositions : [shipPositions],
      hits: [],
    }))
  );

  //вражеские корабли
  const [enemyBoard, setEnemyBoard] = useState(Array(100).fill('empty'));
  const [enemyShips] = useState(() =>
    generateShips().map(shipPositions => ({
      positions: Array.isArray(shipPositions) ? shipPositions : [shipPositions],
      hits: [],
    }))
  );

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
//выставляем корабли игрока на поле 
  useEffect(() => {
    const newPlayerBoard = [...playerBoard];
    playerShips.forEach(ship => {
      ship.positions.forEach(pos => {
        newPlayerBoard[pos] = 'ship';
      });
    });
    setPlayerBoard(newPlayerBoard);
  }, []);

  const isShipDestroyed = ship => {
    return ship.positions.every(pos => ship.hits.includes(pos));
  };

//отмечаем клетки вокруг уничтоженнного корабля 
  const blockCellsAroundShip = (board, ship) => {
    const newBoard = [...board];
    const boardSize = 10;

    ship.positions.forEach(pos => {
      const row = Math.floor(pos / boardSize);
      const col = pos % boardSize;

      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const newRow = row + r;
          const newCol = col + c;
          const newPos = newRow * boardSize + newCol;

          if (
            newRow >= 0 && newRow < boardSize &&
            newCol >= 0 && newCol < boardSize &&
            !ship.positions.includes(newPos) &&
            board[newPos] !== 'hit'
          ) {
            newBoard[newPos] = 'blocked';
          }
        }
      }
    });

    return newBoard;
  };
 
  //игрок стреляет 
  const handleEnemyBoardClick = index => {
    if (
      !isPlayerTurn ||
      enemyBoard[index] === 'hit' ||
      enemyBoard[index] === 'miss' ||
      enemyBoard[index] === 'blocked'
    ) {
      return;
    }

    const newBoard = [...enemyBoard];
    const hitShip = enemyShips.find(ship => ship.positions.includes(index));

    if (hitShip) {
      newBoard[index] = 'hit';
      hitShip.hits.push(index);

      if (isShipDestroyed(hitShip)) {
        setEnemyBoard(blockCellsAroundShip(newBoard, hitShip));
      } else {
        setEnemyBoard(newBoard);
      }
    } else {
      newBoard[index] = 'miss';
      setEnemyBoard(newBoard);
      setIsPlayerTurn(false);
      setTimeout(() => {
        simulateEnemyTurn();
      }, 1000);
    }
  };

//враг стреляет (ход комп.)
  const simulateEnemyTurn = () => {
    const availableCells = playerBoard
      .map((status, index) => ({ status, index }))
      .filter(cell => cell.status !== 'hit' && cell.status !== 'miss' && cell.status !== 'blocked')
      .map(cell => cell.index);

    if (availableCells.length === 0) return;

    const targetIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    const newBoard = [...playerBoard];
    const hitShip = playerShips.find(ship => ship.positions.includes(targetIndex));

    if (hitShip) {
      newBoard[targetIndex] = 'hit';
      hitShip.hits.push(targetIndex);

      if (isShipDestroyed(hitShip)) {
        setPlayerBoard(blockCellsAroundShip(newBoard, hitShip));
        setTimeout(() => simulateEnemyTurn(), 1000);
      } else {
        setPlayerBoard(newBoard);
        setTimeout(() => simulateEnemyTurn(), 1000);
      }
    } else {
      newBoard[targetIndex] = 'miss';
      setPlayerBoard(newBoard);
      setIsPlayerTurn(true);
    }
  };
//проверем, уничтожены ли все корабли одной из сторон
  const isGameOver = () => {
    const playerLost = playerShips.every(isShipDestroyed);
    const enemyLost = enemyShips.every(isShipDestroyed);
    return playerLost || enemyLost;
  };

  return (
    <div className="game">
      <h1>Морской бой</h1>
      <div className="turn-indicator">
        {isGameOver() ? (
          <h2 className="victory-message">
            {enemyShips.every(isShipDestroyed) ? 'Вы победили!' : 'Компьютер победил!'}
          </h2>
        ) : (
          <h2>{isPlayerTurn ? 'Ваш ход' : 'Ход противника...'}</h2>
        )}
      </div>
      <div className="boards-container">
        <div className="board-section">
          <h2>Мои корабли</h2>
          <Board board={playerBoard} handleCellClick={() => {}} showShips={true} />
        </div>
        <div className="board-section">
          <h2>Поле противника</h2>
          <Board
            board={enemyBoard}
            handleCellClick={!isGameOver() && isPlayerTurn ? handleEnemyBoardClick : () => {}}
            showShips={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
