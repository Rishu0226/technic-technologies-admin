import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({ open, title, content, onClose, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#FFFFFF",
            color: "#1F2937",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            boxShadow: "0 15px 40px rgba(31, 41, 55, 0.10)",
          },
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText style={{ color: "#4B5563" }}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ padding: "16px" }}>
        <Button onClick={onClose} style={{ color: "#4B5563", border: "1px solid #E5E7EB" }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" style={{ backgroundColor: "#DC2626", color: "#FFFFFF" }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
