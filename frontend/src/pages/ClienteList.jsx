import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew, PictureAsPdf } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { getClientes, deleteCliente } from '../services/clienteService';
import PdfClienteList from '../components/PdfClienteList';

function ClienteList() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const data = await getClientes();
            setClientes(data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    const handleDeleteClick = (cliente) => {
        toast(
            <div>
                <Typography>Tem certeza que deseja excluir o cliente <strong>{cliente.nome}</strong>?</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteConfirm(cliente.id_cliente)}
                        style={{ marginRight: '10px' }}
                    >
                        Excluir
                    </Button>
                    <Button variant="outlined" size="small" onClick={() => toast.dismiss()}>Cancelar</Button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
            }
        );
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await deleteCliente(id);
            fetchClientes();
            toast.dismiss();
            toast.success('Cliente excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            toast.error('Erro ao excluir cliente.', { position: "top-center" });
        }
    };

    return (
        //Adição do botão baixar cpf
        <TableContainer component={Paper}>
            <Toolbar sx={{ backgroundColor: "#092B38", padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="white">Clientes</Typography>
                <Button color="#804b0f" onClick={() => {}} startIcon={<PictureAsPdf />} sx={{color: 'white', transition:'0.7s', '&:hover': { backgroundColor: '#3D94B6', color:'black'}}}>
                    <PDFDownloadLink
                        document={<PdfClienteList clientes={clientes} />}
                        fileName="clientes.pdf"
                        style={{
                            color: 'inherit',
                        }}
                    >
                        {({ loading }) =>
                            loading ? 'Preparando PDF...' : 'Baixar PDF'
                        }
                    </PDFDownloadLink>
                </Button>
                <Button color="#804b0f" onClick={() => navigate('/cliente')} startIcon={<FiberNew />} sx={{color: 'white', transition:'0.7s', '&:hover': { backgroundColor: '#3D94B6', color:'black'}}}>Novo</Button>
            </Toolbar>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        {!isSmallScreen && (
                            <>
                                <TableCell>CPF</TableCell>
                                <TableCell>Telefone</TableCell>
                            </>
                        )}
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clientes.map((cliente) => (
                        <TableRow key={cliente.id_cliente}>
                            <TableCell>{cliente.id_cliente}</TableCell>
                            <TableCell>{cliente.nome}</TableCell>
                            {!isSmallScreen && (
                                <>
                                    <TableCell>{cliente.cpf}</TableCell>
                                    <TableCell>{cliente.telefone}</TableCell>
                                </>
                            )}
                            <TableCell>
                                <IconButton onClick={() => navigate(`/cliente/view/${cliente.id_cliente}`)}>
                                    <Visibility color="#804b0f" />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/cliente/edit/${cliente.id_cliente}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(cliente)}>
                                    <Delete color="error" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ClienteList;