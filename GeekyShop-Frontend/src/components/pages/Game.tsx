import { Component } from "react";
import { Button, Box, Typography, CardContent } from "@mui/material";
import BlackBG from '../../assets/blackBG.jpg';
import victoryAudio from '../../assets/audios/victory.mp3'; // Import the victory audio

type CardType = {
  value: string;
  id: number;
};

interface GameState {
  cards: CardType[];
  flippedCards: number[];
  matchedCards: number[];
  isGameOver: boolean;
}

class Game extends Component<{}, GameState> {
  private victorySound: HTMLAudioElement;

  state: GameState = {
    cards: [],
    flippedCards: [],
    matchedCards: [],
    isGameOver: false,
  };

  constructor(props: {}) {
    super(props);
    this.victorySound = new Audio(victoryAudio);
  }

  shuffleDeck = (): CardType[] => {
    const cardImages = [
      "🍎", "🍎", "🍌", "🍌", "🍒", "🍒", "🍓", "🍓", "🍍", "🍍",
      "🍉", "🍉", "🍑", "🍑", "🍋", "🍋"
    ];
    return cardImages
      .map((card) => ({ value: card, id: Math.random() }))
      .sort(() => Math.random() - 0.5);
  };

  handleCardClick = (index: number): void => {
    const { flippedCards, matchedCards } = this.state;

    if (flippedCards.length === 2 || matchedCards.includes(index)) return;

    this.setState(
      (prevState) => {
        const newFlippedCards = [...flippedCards, index];
        return { flippedCards: newFlippedCards };
      },
      () => {
        if (this.state.flippedCards.length === 2) {
          this.checkForMatch();
        }
      }
    );
  };

  checkForMatch = (): void => {
    const [firstIndex, secondIndex] = this.state.flippedCards;
    const { cards } = this.state;

    if (cards[firstIndex].value === cards[secondIndex].value) {
      this.setState(
        (prevState) => ({
          matchedCards: [...prevState.matchedCards, firstIndex, secondIndex],
          flippedCards: [],
        }),
        this.checkWinCondition
      );
    } else {
      setTimeout(() => {
        this.setState({ flippedCards: [] });
      }, 1000);
    }
  };

  checkWinCondition = (): void => {
    if (this.state.matchedCards.length === this.state.cards.length) {
      this.setState({ isGameOver: true }, () => {
        this.victorySound.loop = true; // Loop the victory sound
        this.victorySound.play(); // Play the victory sound
      });
    }
  };

  startNewGame = (): void => {
    this.setState(
      {
        cards: this.shuffleDeck(),
        flippedCards: [],
        matchedCards: [],
        isGameOver: false,
      },
      () => {
        this.victorySound.pause(); // Stop the victory sound when starting a new game
        this.victorySound.currentTime = 0; // Reset audio to start
      }
    );
  };

  componentDidMount() {
    this.startNewGame();
  }

  render() {
    const { cards, flippedCards, matchedCards, isGameOver } = this.state;

    return (
      <Box
        sx={{
          backgroundColor: "#FFDEE9",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            padding: 4,
            backgroundImage: `url(${BlackBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: "15px",
            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.5)",
            maxWidth: "700px",
            width: "100%",
            backdropFilter: "blur(5px)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: 3,
              fontWeight: "bold",
              background: "linear-gradient(90deg, rgba(255,136,0,1) 0%, rgba(255,0,180,1) 100%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontSize: "36px",
              textTransform: "uppercase",
            }}
          >
            Memory Match Challenge
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
              marginBottom: 3,
            }}
          >
            {cards.map((card, index) => {
              const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
              return (
                <Box
                  key={index}
                  sx={{
                    width: 100,
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    backgroundColor: isFlipped ? "#ffeb3b" : "#e0e0e0",
                    transform: isFlipped ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.3s ease, background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: isFlipped ? "#ff9800" : "#c7c7c7",
                    },
                  }}
                  onClick={() => this.handleCardClick(index)}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      color: isFlipped ? "#ffffff" : "#000000",
                      fontWeight: "bold",
                    }}
                  >
                    {isFlipped ? card.value : "❓"}
                  </CardContent>
                </Box>
              );
            })}
          </Box>

          {isGameOver && (
            <Typography
              variant="h5"
              sx={{
                marginTop: 3,
                fontWeight: "bold",
                fontSize: "24px",
                textTransform: "uppercase",
                background: "linear-gradient(135deg, #4caf50, #8bc34a)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              You Win! 🎉
            </Typography>
          )}

          <Button
            onClick={this.startNewGame}
            variant="contained"
            color="primary"
            sx={{
              marginTop: 3,
              borderRadius: "30px",
              padding: "15px 30px",
              fontWeight: "bold",
              fontSize: "18px",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: "#3f51b5",
                transform: "scale(1.05)",
              },
            }}
          >
            Start New Game
          </Button>
        </Box>
      </Box>
    );
  }
}

export default Game;
