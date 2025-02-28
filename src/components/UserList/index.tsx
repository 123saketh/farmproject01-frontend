import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import { Delete } from '@mui/icons-material';
import User from '../../Models/User';
import { usersUrl } from '../../constants/url';
import CreateUserComponent from '../CreateUser';
import DeleteDialog from '../Common/Dialog/DeleteDialog';
import { DELETE_USER } from '../../constants/messages';
import { Stack } from '@mui/material';

const paginationModel = { page: 0, pageSize: 5 };

const UsersComponent: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.1},
        { field: 'firstName', headerName: 'First Name', flex: 0.2 },
        { field: 'lastName', headerName: 'Last Name', flex: 0.2 },
        { field: 'email', headerName: 'Email', flex: 0.3 },
        { field: 'jobTitle', headerName: 'Job Title', flex: 0.2 },
        { field: 'gender', headerName: 'Gender', flex: 0.1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.1,
            renderCell: (params) => (
                <IconButton onClick={() => handleOpenDeleteDialog(params.row.id)} disabled={selectedUserId != params.row.id}>
                    <Delete />
                </IconButton>
            ),
        },
    ];

    const fetchUsers = () => {
        setLoading(true);
        axios.get(usersUrl)
            .then(response => {
                setUsers(response.data.users);
                setLoading(false);
            }).catch(error => {
                setError('There was an error fetching the user data!');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserCreated = () => {
        fetchUsers(); // Refresh the users list
    };

    const handleOpenDeleteDialog = (userId: string) => {
        setSelectedUserId(userId);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleDelete = async () => {
        if (selectedUserId) {
            try {
                await axios.delete(`${usersUrl}/${selectedUserId}`);
                fetchUsers(); // Refresh the users list
                setSelectedUserId(null);
                setOpenDeleteDialog(false);
            } catch (error) {
                setError('Error deleting user');
            }
        }
    };

    const handleRowSelection = (selection: any) => {
        setSelectedUserId(selection.length > 0 ? selection[0] : null);
    };


    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Stack spacing={2} sx={{ padding: 2 }}>
            <Stack direction="row" justifyContent="flex-end">
                <CreateUserComponent onUserCreated={handleUserCreated} />
            </Stack>
            <Paper sx={{ height: users.length > 0 ? 'auto' : '80vh', maxHeight: '80vh', width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection={false}
                    onRowSelectionModelChange={handleRowSelection}
                    initialState={{ pagination: { paginationModel } }}
                    sx={{ border: 0 }}
                />
            </Paper>
            <DeleteDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDelete}
                alertMessage={DELETE_USER}
            />
        </Stack>
    );
};

export default UsersComponent;