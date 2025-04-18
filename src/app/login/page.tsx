"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Controller, useForm } from "react-hook-form";
import { Button, Grid, Paper, Typography } from "@mui/material";

const Login = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: { phone: "" },
  });

  const onSubmit = (data: { phone: string }) => {
    router.push("/");
    console.log("phone: ", data.phone);
  };

  return (
    <Grid
      container
      alignItems="center"
      sx={{ height: "100vh" }}
      justifyContent="center"
    >
      <Grid item xs={10} sm={8} md={4}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h5" mb={3} fontWeight="bold">
            Your Phone Number
          </Typography>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Invalid phone number. Please try again.",
              pattern: {
                value: /^\+998\d{9}$/,
                message: "Invalid phone number. Please try again.",
              },
            }}
            render={({ field }) => (
              <>
                <PhoneInput
                  {...field}
                  value={field.value}
                  country={"uz"}
                  inputStyle={{
                    width: "100%",
                  }}
                  onlyCountries={["uz", "ru", "us", "de", "tr"]}
                  onChange={(phone) => field.onChange(`+${phone}`)}
                />
                {errors.phone && (
                  <Typography
                    mt={1}
                    color="error"
                    fontSize="14px"
                    textAlign={"center"}
                  >
                    {errors.phone.message}
                  </Typography>
                )}
              </>
            )}
          />
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{ marginTop: 2, padding: 1.5 }}
          >
            Next
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
