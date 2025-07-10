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
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// styles
import { setUser } from "src/redux/authSlice";
import { UserFormData } from "src/types/user";
import { StyledLogin } from "src/styles/Login";
import { auth, db } from "src/firebase/config";

const AuthPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState(0);

  const dispatch = useDispatch();

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

  const onSubmit = async (data: UserFormData) => {
    try {
      if (tab === 0) {
        // LOGIN
        const userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;

        // Firestore'dan username olish
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        const token = await user.getIdToken();

        dispatch(
          setUser({
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName,
            username: userData?.username || "",
            accessToken: token,
          })
        );

        toast.success("User logged in successfully!");
        router.push("/");
      } else {
        // SIGNUP
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: data.fullName,
          username: data.username,
          createdAt: serverTimestamp(),
        });

        await updateProfile(user, {
          displayName: data.fullName,
        });

        const token = await user.getIdToken();

        dispatch(
          setUser({
            uid: user.uid,
            email: user.email!,
            displayName: data.fullName,
            username: data.username,
            accessToken: token,
          })
        );

        toast.success("User signed up successfully!");
        router.push("/");
      }
    } catch (error: any) {
      if (error?.code === "auth/invalid-credential") {
        toast.error("Invalid email or password.");
      } else if (error?.code === "auth/email-already-in-use") {
        toast.error("Email already in use. Please use a different email.");
      } else {
        toast.error(error?.message || "Something went wrong.");
      }
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
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    type="email"
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
