"use client";

// packages
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Grid,
  Paper,
  Button,
  TextField,
  Typography,
  FormControl,
} from "@mui/material";

// next packages
import { useRouter } from "next/navigation";

const CompleteProfile = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { fullName: "", username: "" },
  });

  const onSubmit = (data: { fullName: string; username: string }) => {
    // router.push("/");
    console.log("data ========", data);
  };

  return (
    <Grid
      container
      alignItems="center"
      sx={{ height: "100vh" }}
      justifyContent="center"
    >
      <Grid item xs={10} sm={8} md={4}>
        <Paper
          elevation={3}
          sx={{
            gap: 2,
            padding: 4,
            display: "flex",
            borderRadius: 2,
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" mb={1} fontWeight="bold">
            Complete Your Profile
          </Typography>
          <Controller
            name="fullName"
            rules={{
              required: true,
            }}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <TextField
                  {...field}
                  required
                  label={"Name"}
                  error={!!errors[field.name]}
                  helperText={
                    !!errors[field.name] && "Please input your full name!"
                  }
                />
              </FormControl>
            )}
          />
          <Controller
            name="username"
            rules={{
              required: true,
            }}
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <TextField
                  {...field}
                  required
                  label={"Username"}
                  error={!!errors[field.name]}
                  helperText={
                    !!errors[field.name] && "Please input your username!"
                  }
                />
              </FormControl>
            )}
          />
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{ padding: 1.5 }}
          >
            Next
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CompleteProfile;
