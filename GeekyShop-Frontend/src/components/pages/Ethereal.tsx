import React, { Component } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import VideoBg from '../../assets/videos/etherealVideoBg.mp4';
import EthMusic from '../../assets/audios/etherealMusic.mp3';

// Styled Components
const VideoContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
  textAlign: "center",
});

const BackgroundVideo = styled("video")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: -2,
});

const Overlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  zIndex: -1,
});

const Title = styled(Typography)({
  position: "relative",
  zIndex: 1,
  color: "rgba(255, 255, 255, 0.9)",//"white"
  fontSize: "1rem",
  textAlign: "center",
  marginTop: "20vh",
  filter: "blur(1px)",
  textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
});

interface EtherealState {
  // Define any state you need here if applicable
}

class Ethereal extends Component<{}, EtherealState> {
  private audioRef: React.RefObject<HTMLAudioElement | null>;

  constructor(props: {}) {
    super(props);
    // Initialize the audioRef
    this.audioRef = React.createRef();
  }

  componentDidMount() {
    // Play music when the component mounts
    if (this.audioRef.current) {
      this.audioRef.current.play();
    }

    // Stop music when the page is about to unload
    window.onbeforeunload = () => {
      if (this.audioRef.current) {
        this.audioRef.current.pause();  // Pause the audio when leaving the page
        this.audioRef.current.currentTime = 0;  // Reset audio to start from the beginning
      }
    };
  }

  componentWillUnmount() {
    // Ensure to clean up the event when the component unmounts
    window.onbeforeunload = null;
  }

  render() {
    return (
      <VideoContainer>
        {/* Video Background */}
        <BackgroundVideo
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={VideoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </BackgroundVideo>

        {/* Overlay */}
        <Overlay />

        {/* Title */}
        <Title variant="h2">Welcome !<br /><br />Relax and Enjoy your Ethereal Journey ✨</Title>

        {/* Audio Element */}
        <audio ref={this.audioRef} loop>
          <source src={EthMusic} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </VideoContainer>
    );
  }
}

export default Ethereal;
