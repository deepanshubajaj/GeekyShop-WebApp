import React, { useState, useEffect, useCallback } from 'react';
import { Button, Container, Typography, Paper, Box, Alert } from '@mui/material';

// Importing audio files
import VictoryAudio from '../../assets/audios/victory.mp3';
import LostAudio from '../../assets/audios/lost.mp3';
import FoodEatAudio from '../../assets/audios/foodEat.mp3'; // New food eat sound

// Type for the snake segment and food position
type Position = {
  x: number;
  y: number;
};

const SecretGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<string>('RIGHT');
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(true);

  // Audio instances
  const victoryAudio = new Audio(VictoryAudio);
  const lostAudio = new Audio(LostAudio);
  const foodEatAudio = new Audio(FoodEatAudio); // New food eat audio

  const startGame = useCallback(() => {
    setSnake([{ x: 5, y: 5 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setIsPaused(false);

    // Stop any playing audio
    victoryAudio.pause();
    victoryAudio.currentTime = 0;
    lostAudio.pause();
    lostAudio.currentTime = 0;
    foodEatAudio.pause(); // Stop food eat sound
    foodEatAudio.currentTime = 0;
  }, [victoryAudio, lostAudio, foodEatAudio]);

  useEffect(() => {
    const alertTimer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(alertTimer);
  }, []);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const interval = setInterval(moveSnake, 200);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [direction, snake, food, gameOver, isPaused]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head: Position = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    if (isCollision(head)) {
      setGameOver(true);
      lostAudio.play(); // Play lost audio
      return;
    }

    newSnake.unshift(head);

    let nextScore = score;

    if (head.x === food.x && head.y === food.y) {
      nextScore = score + 1;
      setScore(nextScore);
      setFood(generateFood());
      foodEatAudio.play(); // Play food eat sound
    } else {
      newSnake.pop();
    }

    if (nextScore >= 3) {
      setGameOver(true);
      victoryAudio.play(); // Play victory audio
      return;
    }

    setSnake(newSnake);
  };

  const isCollision = (head: Position): boolean => {
    return (
      head.x < 0 ||
      head.x >= 20 ||
      head.y < 0 ||
      head.y >= 20 ||
      snake.some((segment) => segment.x === head.x && segment.y === head.y)
    );
  };

  const generateFood = (): Position => {
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    return { x, y };
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <Container>
      <Typography variant="h3" color="primary" align="center" gutterBottom>
        Secret Game: Snake 🐍
      </Typography>

      {showAlert && (
        <Alert severity="info" sx={{ marginBottom: '20px', textAlign: 'center' }}>
          🎉 You are logged in! That's why you can play this game. 🚀
        </Alert>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ padding: '20px', backgroundColor: '#1b1b1b', color: '#fff', textAlign: 'center' }}>
          <Typography variant="h4">Score: {score}</Typography>
        </div>

        <div style={{ marginLeft: '20px' }}>
          <Paper
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(20, 1fr)',
              gridTemplateRows: 'repeat(20, 1fr)',
              width: 300,
              height: 300,
              backgroundColor: '#000',
              border: '3px solid #4caf50',
            }}
          >
            {[...Array(20)].map((_, row) =>
              [...Array(20)].map((_, col) => {
                const isSnake = snake.some((s) => s.x === col && s.y === row);
                const isFood = food.x === col && food.y === row;
                return (
                  <Box
                    key={`${row}-${col}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      border: '1px solid #444',
                      backgroundColor: isSnake ? '#00ff00' : isFood ? '#ff0000' : 'transparent',
                    }}
                  />
                );
              })
            )}
          </Paper>

          {gameOver && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              {score >= 3 ? (
                <Typography variant="h4" color="success.main" gutterBottom>
                  🎉 You Win! Congratulations! 🏆
                </Typography>
              ) : (
                <Typography variant="h4" color="error" gutterBottom>
                  Game Over! 😢 Try Again!
                </Typography>
              )}

              <Button
                sx={{
                  backgroundColor: '#3f51b5',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#303f9f' },
                  display: 'block',
                  margin: '10px auto',
                }}
                onClick={startGame}
              >
                🔄 Restart Game
              </Button>
            </div>
          )}

          {!gameOver && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Button
                sx={{
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#388e3c' },
                }}
                onClick={startGame}
              >
                Start Game
              </Button>

              <Button
                sx={{
                  backgroundColor: isPaused ? '#f57c00' : '#ff9800',
                  color: '#fff',
                  '&:hover': { backgroundColor: isPaused ? '#e64a19' : '#fb8c00' },
                }}
                onClick={togglePause}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default SecretGame;
