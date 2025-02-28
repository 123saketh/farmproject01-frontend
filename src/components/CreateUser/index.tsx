import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Alert, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import User from '../../Models/User';
import { usersUrl } from '../../constants/url';

interface CreateUserComponentProps {
    onUserCreated: () => void;
}

const CreateUserComponent: React.FC<CreateUserComponentProps> = ({ onUserCreated }) => {
    const [user, setUser] = useState<User>(new User());
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(usersUrl, user);
            onUserCreated();
            setUser(new User());
            setError(null);
            handleClose();
        } catch (error) {
            console.error(error);
            setError('Error creating user');
        }
    };

    const handleClickOpen = () => {
        setUser(new User()); // Reset the fields
        setError(null); // Reset the error
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ float: 'right', marginBottom: '10px' }}>
                Create User
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create User</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
                        <TextField name="firstName" label="First Name" value={user.firstName} onChange={handleChange} fullWidth margin="normal" />
                        <TextField name="lastName" label="Last Name" value={user.lastName} onChange={handleChange} fullWidth margin="normal" />
                        <TextField name="email" label="Email" value={user.email} onChange={handleChange} fullWidth margin="normal" />
                        <TextField name="jobTitle" label="Job Title" value={user.jobTitle} onChange={handleChange} fullWidth margin="normal" />
                        <TextField name="gender" label="Gender" value={user.gender} onChange={handleChange} fullWidth margin="normal" />
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" onClick={handleSubmit} color="primary">Create</Button>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CreateUserComponent;