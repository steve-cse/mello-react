import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Mello_Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
export default function Landing() {
  const [photo, setPhoto] = useState(null)
  useEffect(() => {
    fetch(`https://api.unsplash.com/photos/random?query=motivational-quote&client_id=${import.meta.env.VITE_UNSPLASH_API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setPhoto(data);
      })
      .catch((error) => console.error('Error fetching the photo:', error));
  }, []);

  const navigate = useNavigate();
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            photo ? `url(${photo.urls.regular})` : 'none',
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={1} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            mt: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={Mello_Logo}
            alt=""
            width="100"
            style={{ marginBottom: "25px" }}
          />
          <Typography
            component="h1"
            variant="h3"
            sx={{ mb: 4, fontWeight: "bold" }}
          >
            Welcome to Mello
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Your Companion for Mental Health
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2, width: "200px" }}
            onClick={() => navigate("/chat")}
          >
            Start Chatting
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            sx={{ width: "200px" }}
            onClick={() => navigate("/incognito")}
          >
            Incognito Mode
          </Button>

          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              height: 75,
              textAlign: "center",
            }}
            textAlign="center"
          >
            <Typography variant="body2" color="textSecondary">
              <a
                onClick={() => navigate("/about")}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Help & About
              </a>{" "}
              |{" "}
              <a
                href="https://github.com/steve-cse/mello-react"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Github
              </a>{" "}
              |{" "}
              <a
                href="https://huggingface.co/steve-cse/MelloGPT"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Hugging Face
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
