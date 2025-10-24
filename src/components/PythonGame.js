import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function PythonGame() {
    const [image, setImage] = useState('');
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('start_game');
        });

        socket.on('connect_error', (error) => {
            setError('서버 연결에 실패했습니다.');
        });

        socket.on('game_frame', (data) => {
            setImage(`data:image/png;base64,${data.image}`);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="python-game">
            <h1>Python Game in React</h1>
            {!isConnected ? (
                <div className="loading">서버에 연결 중...</div>
            ) : !image ? (
                <div className="loading">게임 로딩 중...</div>
            ) : (
                <img src={image} alt="Game frame" className="game-frame" />
            )}
        </div>
    );
}

export default PythonGame;