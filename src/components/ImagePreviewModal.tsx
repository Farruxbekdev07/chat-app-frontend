import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSend: () => void;
  imageUrl: string | null;
  title?: string;
  confirmLabel?: string;
}

const ImagePreviewModal = ({
  open,
  onClose,
  onSend,
  imageUrl,
  title = "Preview Image",
  confirmLabel = "Save",
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="body">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt="Preview"
            sx={{
              width: "100%",
              maxHeight: "60vh",
              objectFit: "contain",
              borderRadius: 2,
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No image selected.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSend} variant="contained" disabled={!imageUrl}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImagePreviewModal;
