import { Box, Tabs, Tab, Typography, List, ListItem, Button } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { API_URL } from "@/services/api";
import { Lesson } from "./types";
import { formatTamanhoArquivo } from "./utils";

interface LessonContentTabsProps {
  aulaAtual: Lesson;
  tabValue: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const LessonContentTabs = ({ aulaAtual, tabValue, handleTabChange }: LessonContentTabsProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          borderBottom: "2px solid #EDEDED",
          px: 2,
          "& .MuiTab-root": {
            color: "#666666",
            fontFamily: "Poppins",
            fontSize: "15px",
            fontWeight: 500,
            textTransform: "none",
            minWidth: 120,
            py: 2,
            transition: "color 0.3s ease",
            "&.Mui-selected": {
              color: "#1F1D2B",
              fontWeight: 700,
            },
            "&:hover": {
              color: "#1F1D2B",
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#1F1D2B",
            height: 4,
            borderRadius: "4px 4px 0 0",
          },
        }}
      >
        <Tab icon={<DescriptionIcon />} iconPosition="start" label="Instruções" />
        <Tab icon={<AttachFileIcon />} iconPosition="start" label="Materiais de Apoio" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {tabValue === 0 && (
          <Typography
            sx={{
              fontFamily: "Poppins",
              color: "#333333",
              fontSize: "15px",
              lineHeight: 2,
              whiteSpace: "pre-line",
            }}
          >
            {aulaAtual.descricao}
          </Typography>
        )}

        {tabValue === 1 && (
          <Box>
            {aulaAtual.attachments && aulaAtual.attachments.length > 0 ? (
              <List sx={{ p: 0 }}>
                {aulaAtual.attachments.map((anexo) => (
                  <ListItem
                    key={anexo.id}
                    sx={{
                      px: 0,
                      py: 1,
                      borderBottom: "1px solid #EDEDED",
                      "&:last-child": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <AttachFileIcon sx={{ color: "#1F1D2B" }} />
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontWeight: 600,
                              color: "#1F1D2B",
                              fontSize: "14px",
                            }}
                          >
                            {anexo.titulo}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              color: "#666666",
                              fontSize: "12px",
                            }}
                          >
                            {anexo.tipo_arquivo} • {formatTamanhoArquivo(anexo.tamanho_kb)}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          fontFamily: "Poppins",
                          textTransform: "none",
                          borderColor: "#1F1D2B",
                          color: "#1F1D2B",
                          "&:hover": {
                            borderColor: "#1F1D2B",
                            backgroundColor: "rgba(31, 29, 43, 0.04)",
                          },
                        }}
                        onClick={() => {
                          const url = anexo.arquivo.startsWith("http")
                            ? anexo.arquivo
                            : `${API_URL}${anexo.arquivo}`;
                          window.open(url, "_blank");
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <AttachFileIcon sx={{ fontSize: 48, color: "#CCCCCC", mb: 2 }} />
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    color: "#666666",
                    fontSize: "15px",
                  }}
                >
                  Esta aula não possui materiais de apoio.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
