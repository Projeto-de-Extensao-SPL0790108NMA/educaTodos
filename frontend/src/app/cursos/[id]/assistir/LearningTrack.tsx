import { Box, Typography, Button, List, ListItem, ListItemButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Course, Lesson } from "./types";
import { converterParaRomano } from "./utils";

interface LearningTrackProps {
  curso: Course;
  aulaAtual: Lesson;
  aulasCompletas: Set<number>;
  secoesExpandidas: Set<number>;
  toggleSecao: (secaoId: number) => void;
  mudarAula: (aulaId: number) => void;
  cursoCompleto: boolean;
  concluindoCurso: boolean;
  todasAulasCompletas: boolean;
  concluirCurso: () => void;
}

export const LearningTrack = ({
  curso,
  aulaAtual,
  aulasCompletas,
  secoesExpandidas,
  toggleSecao,
  mudarAula,
  cursoCompleto,
  concluindoCurso,
  todasAulasCompletas,
  concluirCurso,
}: LearningTrackProps) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 16,
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: "2px solid #EDEDE",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#ffffff",
            fontFamily: "Poppins",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Trilha de Aprendizagem
        </Typography>
      </Box>

      <Box
        sx={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {},
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#1F1D2B",
            borderRadius: "4px",
          },
        }}
      >
        {curso.sections
          .sort((a, b) => a.ordem - b.ordem)
          .map((section, index) => (
            <Box
              key={section.id}
              sx={{
                borderBottom:
                  index < curso.sections.length - 1
                    ? "1px solid rgba(255, 255, 255, 0.2)"
                    : "none",
              }}
            >
              {/* Título da Seção - Clicável */}
              <Box
                onClick={() => toggleSecao(section.id)}
                sx={{
                  px: 3,
                  py: 2,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                >
                  Seção {converterParaRomano(section.ordem)}: {section.titulo}
                </Typography>
                {secoesExpandidas.has(section.id) ? (
                  <ExpandLessIcon sx={{ color: "#ffffff" }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#ffffff" }} />
                )}
              </Box>

              {/* Lista de Aulas - Expandível */}
              {secoesExpandidas.has(section.id) && (
                <List sx={{ p: 0 }}>
                  {section.lessons
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((lesson) => (
                      <ListItem key={lesson.id} sx={{ p: 0 }}>
                        <ListItemButton
                          selected={aulaAtual.id === lesson.id}
                          onClick={() => mudarAula(lesson.id)}
                          sx={{
                            px: 3,
                            py: 2,
                            borderLeft:
                              aulaAtual.id === lesson.id
                                ? "4px solid #1F1D2B"
                                : "4px solid transparent",
                            backgroundColor:
                              aulaAtual.id === lesson.id
                                ? "rgba(31, 29, 43, 0.08)"
                                : "transparent",
                            "&:hover": {
                              backgroundColor:
                                aulaAtual.id === lesson.id
                                  ? "rgba(31, 29, 43, 0.12)"
                                  : "rgba(31, 29, 43, 0.04)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              width: "100%",
                            }}
                          >
                            {aulasCompletas.has(lesson.id) ? (
                              <CheckCircleIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#2C5F2D",
                                }}
                              />
                            ) : (
                              <PlayArrowIcon
                                sx={{
                                  fontSize: 20,
                                  color:
                                    aulaAtual.id === lesson.id
                                      ? "#ffffff"
                                      : "#ffffff",
                                }}
                              />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  fontFamily: "Poppins",
                                  fontWeight:
                                    aulaAtual.id === lesson.id ? 600 : 500,
                                  color:
                                    aulaAtual.id === lesson.id
                                      ? "#ffffff"
                                      : "#ffffff",
                                  fontSize: "13px",
                                }}
                              >
                                {lesson.ordem}. {lesson.titulo}
                              </Typography>
                              {lesson.duracao_minutos > 0 && (
                                <Typography
                                  sx={{
                                    fontFamily: "Poppins",
                                    color: "#ffffff",
                                    fontSize: "11px",
                                    mt: 0.5,
                                  }}
                                >
                                  {lesson.duracao_minutos} min
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              )}
            </Box>
          ))}
      </Box>

      {/* Botão de Concluir Curso */}
      <Box sx={{ p: 3 }}>
        {!cursoCompleto && (
          <Button
            variant="contained"
            fullWidth
            disabled={concluindoCurso || !todasAulasCompletas}
            onClick={concluirCurso}
            sx={{
              backgroundColor: "#2C5F2D",
              color: "#FFFFFF",
              fontFamily: "Poppins",
              fontWeight: 500,
              textTransform: "none",
              py: 1.5,
              "&:hover": {
                backgroundColor: "#234d24",
              },
              "&:disabled": {
                backgroundColor: "#CCCCCC",
                color: "#666666",
              },
            }}
          >
            {concluindoCurso
              ? "Concluindo..."
              : todasAulasCompletas
              ? "Concluir Curso"
              : "Complete todas as aulas"}
          </Button>
        )}

        {cursoCompleto && (
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#2C5F2D",
              color: "#2C5F2D",
              fontFamily: "Poppins",
              fontWeight: 500,
              textTransform: "none",
              py: 1.5,
              "&:hover": {
                borderColor: "#234d24",
                backgroundColor: "rgba(44, 95, 45, 0.04)",
              },
            }}
          >
            ✓ Curso Concluído
          </Button>
        )}
      </Box>
    </Box>
  );
};
