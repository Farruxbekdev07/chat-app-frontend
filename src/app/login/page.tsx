"use client";

// packages
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Tab,
  Tabs,
  Grid,
  Paper,
  Button,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputAdornment,
} from "@mui/material";

// styles
import { StyledLogin } from "src/styles/Login";

const AuthPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    if (tab === 0) {
      console.log("Login data:", data);
      // login logic
    } else {
      console.log("SignUp data:", data);
      // signup logic
    }
  };

  const handleTabChange = (_: any, newValue: number) => {
    setShowPassword(false);
    setTab(newValue);
    reset();
  };

  return (
    <StyledLogin>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Grid item xs={10} sm={8} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>

            <Typography variant="h5" mb={3} mt={2} fontWeight="bold">
              {tab === 0 ? "Login" : "Sign Up"}
            </Typography>

            {tab === 1 && (
              <>
                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: "Please input your full name!" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      fullWidth
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: "Please choose a username!" }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Username"
                      fullWidth
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </>
            )}

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Please input your email address!",
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    label="Email"
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                </FormControl>
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Please input your password!",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Password"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              sx={{ mt: 2, py: 1.5 }}
            >
              {tab === 0 ? "Login" : "Sign Up"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </StyledLogin>
  );
};

export default AuthPage;
