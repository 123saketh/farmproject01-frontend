import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface DeleteDialogProps {
    open: boolean;
    alertMessage: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, alertMessage, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {alertMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="primary">
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;