import React, { useState } from "react";
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
import Alert from "@mui/material/Alert"; // Import Alert component from Material-UI
import { supabaseClient } from '../config/supabase';
import { Link as RouterLink, useNavigate } from "react-router-dom";


function Signup() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();
    const [loading, setLoading] = useState(false);
    const [signupError, setSignupError] = useState(null);
    const [signupSuccess, setSignupSuccess] = useState(null);
    async function pushEmptyChatData(supabaseUID) {
        try {
            await supabaseClient
                .from('chatdata')
                .insert({
                    supabase_uid: supabaseUID,
                    history: ["New Chat"],
                    messages: []
                });
        } catch (error) {
            console.error('Error pushing empty chat data:', error.message);
        }
    }
    const onSubmit = async (info) => {
        setLoading(true);
        try {
            const { data,error } = await supabaseClient.auth.signUp({
                email: info.email,
                password: info.password
            });
            if (error) throw error;
            console.log("Sign up Success");
            setSignupSuccess("Sign up Successful. Redirecting to Login....");
            setSignupError(null); // Clear any previous login errors
            await pushEmptyChatData(data.session.user.id);
            setTimeout(function () {
                navigate('/login')
            }, 5000);

        } catch (err) {
            setSignupError(err.message);
            setSignupSuccess(null);
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
                    <Avatar
                        src="/mello_avatar.png"
                        sx={{ m: 1, height: "75px", width: "75px" }}
                    >
                        M
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
                        Create your Account
                    </Typography>
                    {signupSuccess && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {signupSuccess}
                        </Alert>
                    )}
                    {signupError && ( // Conditionally render the Alert component if signupError exists
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {signupError}
                        </Alert>
                    )}
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
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            error={!!errors.email}
                            helperText={errors.email && errors.email.message}
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
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters long"
                                }
                            })}
                            error={!!errors.password}
                            helperText={errors.password && errors.password.message}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password_confirmation"
                            label="Confirm Password"
                            type="password"
                            id="password_confirmation"
                            autoComplete="new-password"
                            {...register("password_confirmation", {
                                validate: value => value === getValues('password') || 'The passwords do not match'
                            })}
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation && errors.password_confirmation.message}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/login" variant="body2" color="secondary" underline="hover">
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

export default Signup;
