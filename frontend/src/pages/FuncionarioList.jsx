// useEffect executar efeitos colaterais, como buscar dados da API / Proxy/BFF ao carregar o componente.
// useState gerenciar o estado local do componente, como a lista de funcionários.
import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery } from "@mui/material";
import { Edit, Delete, Visibility, FiberNew, PictureAsPdf } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import { getFuncionarios, deleteFuncionario } from "../services/funcionarioService";
import PdfFuncionarioList from '../components/PdfFuncionarioList';

function FuncionarioList() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [funcionarios, setFuncionarios] = useState([]);

    useEffect(() => {
        fetchFuncionarios();
    }, []);

    const fetchFuncionarios = async () => {
        try {
            const data = await getFuncionarios();
            setFuncionarios(data);
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error);
        }
    };
    
    const handleDeleteClick = (funcionario) => {
        toast(
            <div>
                <Typography>
                    Tem certeza que deseja excluir o funcionário{" "}
                    <strong>{funcionario.nome}</strong>?
                </Typography>
                <div
                    style={{
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteConfirm(funcionario.id_funcionario)}
                        style={{ marginRight: "10px" }}
                    >
                        Excluir
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => toast.dismiss()}
                    >
                        Cancelar
                    </Button>
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
            await deleteFuncionario(id);
            fetchFuncionarios();
            toast.dismiss();
            toast.success("Funcionário excluído com sucesso!", {
                position: "top-center",
            });
        } catch (error) {
            console.error("Erro ao deletar funcionário:", error);
            toast.error("Erro ao excluir funcionário.", { position: "top-center" });
        }
    };

    return (
        <TableContainer component={Paper}>
            <Toolbar sx={{backgroundColor: '#092B38', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6" color="white">Funcionários</Typography>
                <Button color="#804b0f" onClick={() => { }} startIcon={<PictureAsPdf />} sx={{color: 'white', transition:'0.7s', '&:hover': { backgroundColor: '#3D94B6', color:'black'}}}>
                    <PDFDownloadLink
                        document={<PdfFuncionarioList funcionarios={funcionarios} />}
                        fileName="funcionarios.pdf"
                        style={{
                            color: 'inherit',
                        }}
                    >
                        {({ loading }) =>
                            loading ? 'Preparando PDF...' : 'Baixar PDF'
                        }
                    </PDFDownloadLink>
                </Button>
                <Button color="#804b0f" onClick={() => navigate("/funcionario")} startIcon={<FiberNew />} sx={{color: 'white', transition:'0.7s', '&:hover': { backgroundColor: '#3D94B6', color:'black'}}}>Novo</Button>
            </Toolbar>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        {!isSmallScreen && (
                            <>
                                <TableCell>Matrícula</TableCell>
                                <TableCell>Telefone</TableCell>
                                <TableCell>Grupo</TableCell>
                            </>
                        )}
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {funcionarios.map((funcionario) => (
                        <TableRow key={funcionario.id_funcionario}>
                            <TableCell>{funcionario.id_funcionario}</TableCell>
                            <TableCell>{funcionario.nome}</TableCell>
                            <TableCell>{funcionario.cpf}</TableCell>
                            {!isSmallScreen && (
                                <>
                                    <TableCell>{funcionario.matricula}</TableCell>
                                    <TableCell>{funcionario.telefone}</TableCell>
                                    <TableCell>{funcionario.grupo}</TableCell>
                                </>
                            )}
                            <TableCell>
                                <IconButton
                                    onClick={() =>
                                        navigate(`/funcionario/view/${funcionario.id_funcionario}`)
                                    }
                                >
                                    <Visibility color="#804b0f" />
                                </IconButton>
                                <IconButton
                                    onClick={() =>
                                        navigate(`/funcionario/edit/${funcionario.id_funcionario}`)
                                    }
                                >
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(funcionario)}>
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
export default FuncionarioList;
