import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Mello_Logo from "../assets/logo.png";
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
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { supabaseClient } from '../config/supabase';

function UpdatePassword() {
    const [loading, setLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [linkError, setLinkError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        console.log(location.hash);
        const params = new URLSearchParams(location.hash);
        const errorMessage = params.get('error_description');
        if (errorMessage) {
            setLinkError(errorMessage);
        }
    }, [location.hash]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const { error } = await supabaseClient.auth.updateUser({
                password: data.newPassword
            });
            if (error) throw error;
            setUpdateError(null); // Clear any previous update errors
            setUpdateSuccess("Password updated. Redirecting to Login....")
            console.log("Password Update Success");
            setTimeout(function () {
                navigate('/login')
            }, 5000);
        } catch (err) {
            setUpdateError(err.message);
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
                    <img src={Mello_Logo} alt="" width="100" style={{marginBottom:'25px'}} />
                    <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
                        Update Password
                    </Typography>
                    {updateSuccess && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {updateSuccess}
                        </Alert>
                    )}
                    {updateError && <Alert severity="error" sx={{ mt: 1 }}>{updateError}</Alert>}
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
                            name="newPassword"
                            label="New Password"
                            type="password"
                            id="newPassword"
                            autoComplete="new-password"
                            {...register("newPassword", { required: true, minLength: 6 })}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword && "Password must be at least 6 characters"}
                            disabled={linkError}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                            disabled={loading || linkError}
                        >
                            Update Password
                        </Button>
                        <Grid container direction="column" alignItems="center">
                            <Grid item xs>
                                <Link component={RouterLink} to="/login" variant="body2" color="secondary" underline="hover">
                                    {"Remember your password? Log In"}
                                </Link>
                            </Grid>
                            <Grid item sx={{ mt: 1 }}>
                                <Link component={RouterLink} to="/signup" variant="body2" color="secondary" underline="hover">
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

export default UpdatePassword;
