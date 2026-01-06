const isPositionValid = (position, length, isHorizontal, existingShips) => {
    const boardSize = 10;
    const row = Math.floor(position / boardSize);
    const col = position % boardSize;
  
    // Проверяем, влезает ли корабль
    if (isHorizontal) {
      if (col + length > boardSize) return false;
    } else {
      if (row + length > boardSize) return false;
    }
  
    // Проверяем: свободны ли клетки + нет ли рядом других кораблей
    for (let i = 0; i < length; i++) {
      const currentPos = isHorizontal ? position + i : position + i * boardSize;
      const currentRow = Math.floor(currentPos / boardSize);
      const currentCol = currentPos % boardSize;
  
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const checkRow = currentRow + r;
          const checkCol = currentCol + c;
  
          if (
            checkRow >= 0 &&
            checkRow < boardSize &&
            checkCol >= 0 &&
            checkCol < boardSize
          ) {
            const checkPos = checkRow * boardSize + checkCol;
            if (existingShips.has(checkPos)) return false;
          }
        }
      }
    }
  
    return true;
  };  

  const generateShips = () => {                                                     //основная функция генерации кораблей 
    const ships = [];
    const shipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    const existingShips = new Set ();
    const boardSize = 10;
    
    for (const length of shipLengths) {                                          // цикл, размещаем каждый кораблю по очереди 
        let placed = false; 
        let attempts = 0;
        const maxAttemps = 100; 

        while (!placed && attempts < maxAttemps) {       //случайная ориентация и позиция                                      
                                                         // если можно поставить - ставим 
            const isHorizontal = Math.random() < 0.5;
            const position = Math.floor(Math.random() * boardSize * boardSize);

            if (isPositionValid(position, length, isHorizontal, existingShips)) {
                for (let i = 0; i < length; i++) {
                    const shipPosition = isHorizontal ? position + i : position + i * boardSize;
                    ships.push(shipPosition);
                    existingShips.add(shipPosition);
                }
                placed = true;
            }
            attempts++; 
        }
        if (!placed) {                   // если не получится - начнём заново
            return generateShips();
        }
    }
    return ships.sort((a, b) => a - b);
  };

  export default generateShips;