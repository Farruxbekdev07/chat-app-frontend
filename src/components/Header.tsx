"use client";

// packages
import React from "react";
import { Typography } from "@mui/material";

// styles
import { StyledHeader } from "src/styles/Header";

interface Props {
  name: string;
}

const Header = ({ name }: Props) => {
  return (
    <StyledHeader>
      <Typography>{name}</Typography>
    </StyledHeader>
  );
};

export default Header;
