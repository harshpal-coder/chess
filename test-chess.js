import { Chess } from 'chess.js';

try {
    const chess = new Chess();
    console.log('Chess created successfully');
    console.log(chess.fen());
} catch (e) {
    console.error('Error creating Chess:', e);
}
