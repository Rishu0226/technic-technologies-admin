"use client";

import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { Trash2 } from "lucide-react";

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
          No
        </Button>
        <Button onClick={onConfirm} variant="contained" style={{ backgroundColor: "#DC2626", color: "#FFFFFF" }}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function DeleteIconButton({
  onConfirm,
  message = "Are you sure you want to delete this?",
  className = "p-2 text-technic-error hover:bg-technic-error-soft rounded-lg",
}: {
  onConfirm: () => void | Promise<void>;
  message?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <Trash2 className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Delete</span>
      </button>
      <ConfirmDialog
        open={open}
        title="Delete"
        content={message}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          void Promise.resolve(onConfirm()).finally(() => setOpen(false));
        }}
      />
    </>
  );
}
