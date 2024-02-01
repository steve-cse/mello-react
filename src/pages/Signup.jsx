import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
function Signup() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get("email"),
            password: data.get("password"),
        });
    };
    return (
        <Paper elevation={1} sx={{ display: "flex", height: "100vh" }}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar
                        src="/mello_avatar.png"
                        sx={{ m: 1, height: "75px", width: "75px" }}
                    >
                        M
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
                    Create your Account
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Create Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                         <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password-confirmation"
                            label="Confirm Password"
                            type="password"
                            id="password-confirmation"
                            autoComplete="new-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Already have an account? Log in"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Paper>
    );

}

export default Signup