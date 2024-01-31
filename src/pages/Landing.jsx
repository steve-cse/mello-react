import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function Landing() {
    return (
        <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: "url(https://source.unsplash.com/featured/?quotes)",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: (t) =>
                        t.palette.mode === "light"
                            ? t.palette.grey[50]
                            : t.palette.grey[900],
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <img
                        src="/logo.png"
                        alt="mello_logo"
                        style={{ width: "140px", marginBottom: "20px" }}
                    />
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
                    <Button variant="contained" color="primary" sx={{ mb: 2, width: '200px' }}>
                        Log in
                    </Button>
                    <Button variant="contained" color="primary" sx={{ mb: 2 , width: '200px'}}>
                        Sign up
                    </Button>
                    <Button variant="outlined" color="secondary" sx={{  width: '200px'}}>
                        Try as Guest
                    </Button>
                    
                </Box>
            </Grid>
        </Grid>
    );
}
