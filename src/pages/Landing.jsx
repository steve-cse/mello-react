import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {useNavigate } from "react-router-dom";
export default function Landing() {
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
                        "url(https://source.unsplash.com/featured/?motivational-quotes)",
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
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >

                    <Avatar sx={{ mb: '20px', height: '85px', width: '85px' }} alt="mello_logo" src="/mello_avatar.png">
                        M
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h3"
                        sx={{ mb: 4, fontWeight: "bold" }}
                    >
                        Welcome to Mello
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, fontStyle: "italic" }}>
                        {" "}
                        Your Companion for Mental Health
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mb: 2, width: "200px" }}
                        onClick={() => navigate("/login")}
                    >
                        Log in
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mb: 2, width: "200px" }}
                        onClick={() => navigate("/signup")}
                    >
                        Sign up
                    </Button>
                    <Button variant="outlined" color="secondary" sx={{ width: "200px" }}  onClick={() => navigate("/chat")}>
                        Try as Guest
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
}
