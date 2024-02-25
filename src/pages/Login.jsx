import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
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
import Alert from "@mui/material/Alert";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { supabaseClient } from '../config/supabase';

function Login() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const { error } = await supabaseClient.auth.signInWithPassword({
                email: data.email,
                password: data.password
            });
            if (error) throw error;
            console.log("Auth Success");
            setLoginError(null); // Clear any previous login errors
            navigate("/chat");
        } catch (err) {
            setLoginError(err.message);
        } finally {
            setLoading(false);
        }
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
                    {/* <Avatar
                        src="/mello_avatar.png"
                        sx={{ m: 1, height: "75px", width: "75px" }}
                    >
                        M
                    </Avatar> */}
                    <img src="/logo.png" alt="" width="100" style={{margin:'25px'}} />
                    <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
                        Welcome Back
                    </Typography>
                    {loginError && <Alert severity="error" sx={{ mt: 1 }}>{loginError}</Alert>}
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
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
                            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                            error={!!errors.email}
                            helperText={errors.email && "Email is required"}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            {...register("password", { required: true })}
                            error={!!errors.password}
                            helperText={errors.password && "Password is required"}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            <Link component={RouterLink} to="/forgot-password" variant="body2" color="secondary" underline="hover">
                                    {"Forgot password?"}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link  component={RouterLink} to="/signup" variant="body2" color="secondary" underline="hover">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Paper>
    );
}

export default Login;
