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
import Alert from "@mui/material/Alert";
import { Link as RouterLink } from "react-router-dom";
import { supabaseClient } from '../config/supabase';

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/update-password`,
        }
      );
      if (error) throw error;
      setResetError(null); // Clear any previous reset errors
      setResetSuccess("Check your inbox for further instructions.")
      console.log("Reset Password Success");
    } catch (err) {
      setResetError(err.message);
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
          <img src="/logo.png" alt="" width="100" style={{marginBottom:'25px'}} />
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            Forgot Password
          </Typography>
          {resetSuccess && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {resetSuccess}
                        </Alert>
                    )}
          {resetError && <Alert severity="error" sx={{ mt: 1 }}>{resetError}</Alert>}
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              disabled={loading}
            >
              Reset Password
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

export default ForgotPassword;
