import React from 'react';
import Square from './Square';

// В React с JavaScript мы не используем типы и интерфейсы,
// просто описываем компонент с пропсами как обычные аргументы.

const Board = ({ board, handleCellClick, showShips }) => {
  return (
    <div className="board">
      {board.map((status, index) => (
        <Square
          key={index}            // уникальный ключ для списка
          index={index}          // передаём индекс ячейки
          status={status}        // статус клетки: 'empty', 'hit', 'miss', 'ship', 'blocked'
          onClick={handleCellClick}  // обработчик клика
          showShips={showShips}  // показывать ли корабли на доске
        />
      ))}
    </div>
  );
};

export default Board;
