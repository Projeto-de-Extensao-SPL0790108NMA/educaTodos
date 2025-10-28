"use client";

import { useRouter } from "next/navigation";
import { API_URL } from "../../services/api";
import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();
  
  console.log("API_URL =", API_URL);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: matricula.trim(), // <-- alteração necessária
          password 
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Erro ${res.status}`);
      }

      const data = await res.json(); // ex: { access, refresh, user }

      localStorage.setItem("access", data.access || "");
      localStorage.setItem("refresh", data.refresh || "");
      localStorage.setItem("user", JSON.stringify(data.user || null));

      router.push("/");
    } catch (e) {
      console.error("Erro no login:", e);
      setErr("Falha no login. Verifique matrícula/usuário e senha ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1F1D2B",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            Entrar
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="matricula"
              label="Matrícula"
              name="matricula"
              autoComplete="username"
              autoFocus
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}