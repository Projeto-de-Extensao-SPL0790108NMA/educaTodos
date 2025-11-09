import { Box, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { API_URL } from "@/services/api";
import { Lesson } from "./types";

interface VideoPlayerProps {
  aulaAtual: Lesson;
  setVideoRef: (ref: HTMLVideoElement | null) => void;
}

export const VideoPlayer = ({ aulaAtual, setVideoRef }: VideoPlayerProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "#000000",
        borderRadius: "12px",
        overflow: "hidden",
        aspectRatio: "16/9",
        mb: 3,
        position: "relative",
      }}
    >
      {aulaAtual.video ? (
        <video
          ref={(el) => setVideoRef(el)}
          controls
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
          src={
            aulaAtual.video.startsWith("http")
              ? aulaAtual.video
              : `${API_URL}${aulaAtual.video}`
          }
        >
          Seu navegador não suporta a tag de vídeo.
        </video>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 80, color: "#666666" }} />
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "18px",
              fontWeight: 600,
              color: "#666666",
            }}
          >
            Vídeo não disponível
          </Typography>
        </Box>
      )}
    </Box>
  );
};
