import React, { Component } from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import BlackBG from '../../assets/blackBG.jpg';
import VideoToPlay from '../../assets/videos/VideoToPlay.mp4';

// Styled Components
const PageContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100vh",
  backgroundImage: `url(${BlackBG})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  color: "white",
  textAlign: "center",
});

const VideoPlayer = styled("video")({
  width: "70%",
  maxWidth: "700px",
  border: "3px solid white",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.7)",
  marginBottom: "20px",
});

const Title = styled(Typography)({
  fontSize: "2.5rem",
  fontWeight: "bold",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  marginBottom: "10px",
});

// ✅ Allowing null in the ref type
interface VideoPlayState {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

class VideoPlay extends Component<{}, VideoPlayState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      videoRef: React.createRef<HTMLVideoElement | null>(), // Updated ref type
    };
  }

  handleReplay = () => {
    const video = this.state.videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  render() {
    return (
      <PageContainer>
        <Title variant="h2">🎥 Let's Explore !! 🌍</Title>

        <VideoPlayer
          ref={this.state.videoRef}
          controls
          autoPlay
          muted
          onEnded={this.handleReplay}
        >
          <source src={VideoToPlay} type="video/mp4" />
          Your browser does not support the video tag.
        </VideoPlayer>

        <Button
          variant="contained"
          color="secondary"
          onClick={this.handleReplay}
          sx={{
            marginTop: "10px",
            backgroundColor: "#ff4081",
            '&:hover': { backgroundColor: "#f50057" }
          }}
        >
          🔄 Replay Video
        </Button>
      </PageContainer>
    );
  }
}

export default VideoPlay;
