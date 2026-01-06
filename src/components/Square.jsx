import React from 'react';

function Square ({index, status, onClick, showShips}) {
    let symbol = '';

    if (status === 'hit') symbol = '❌';
    else if (status === 'miss') symbol = '⭕';
    else if (status === 'ship' && showShips) symbol = '🚢';
    else if (status === 'blocked') symbol = '•';
    else symbol = '⬜';

    return (
    <div 
    className={`cell ${status}`} 
    onClick={() => onClick(index)}
    style={{ cursor: status === 'blocked' ? 'not-allowed' : 'pointer' }}
    >
    {symbol}

    </div>
    );
}

export default Square;
