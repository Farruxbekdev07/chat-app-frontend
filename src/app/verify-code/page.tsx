"use client";

// packages
import React, { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid, Paper, TextField, Button, Typography, Box } from "@mui/material";

// local folders
import { OTP_LENGTH } from "src/constants";

const VerifyCodeCustom = () => {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: Array(OTP_LENGTH).fill(""),
    },
  });

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    setValue(`code.${index}`, value, { shouldValidate: true });
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !getValues(`code.${index}`) && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onSubmit = (data: { code: string[] }) => {
    const joined = data.code.join("");
    console.log("Tasdiqlash kodi:", joined);
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh" }}
    >
      <Grid item xs={10} sm={6} md={4}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h4" fontWeight="semibold">
            Enter verification code
          </Typography>

          <Box display="flex" justifyContent="center" gap={1}>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <Controller
                key={index}
                name={`code.${index}`}
                control={control}
                rules={{
                  required: "Kod to‘liq kiritilmagan",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={(el) => (inputsRef.current[index] = el)}
                    onChange={(e) => handleChange(index, e.target.value.trim())}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      handleKeyDown(e, index)
                    }
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: "center",
                        fontSize: "3rem",
                        padding: 0,
                      },
                    }}
                    error={!!errors.code?.[index]}
                    helperText={
                      errors.code?.[index]?.message ? "❗️" : undefined
                    }
                  />
                )}
              />
            ))}
          </Box>

          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
            sx={{ padding: 1.5 }}
          >
            Verify
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default VerifyCodeCustom;
