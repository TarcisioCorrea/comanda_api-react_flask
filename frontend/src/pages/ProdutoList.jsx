import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew, PictureAsPdf } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { getProdutos, deleteProduto } from '../services/produtoService';
import PdfProdutoList from '../components/PdfProdutoList';

function ProdutoList() {
    // O useNavigate é um hook que permite navegar programaticamente entre as rotas da aplicação
    const navigate = useNavigate();

    // Hook para detectar o tamanho da tela
    // theme: Obtém o tema do Material-UI.
    const theme = useTheme();

    // Aqui, estamos verificando se a tela é menor ou igual ao breakpoint 'sm' definido no tema
    // O valor 'sm' é definido no tema do Material-UI e representa um breakpoint específico (geralmente 600px)
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // useMediaQuery: Usado para verificar o tamanho da tela e ajustar a interface.
    // useState: usado para gerenciar o estado local do componente, como a lista.
    // Aqui, estamos criando um estado chamado Produtos e uma função para atualizá-lo chamada setProdutos.
    // O estado inicial é um array vazio, que será preenchido com os dados dos retornados após a chamada da API / Proxy/BFF.
    const [produtos, setProdutos] = useState([]);

    // useEffect: usado para executar efeitos colaterais, como buscar dados da API / Proxy/BFF ao carregar o componente.
    // O array vazio [] significa que o efeito será executado apenas uma vez, quando o componente for montado.
    useEffect(() => {
        fetchProdutos();
    }, []);

    // getProdutos: função que faz a chamada à API / Proxy/BFF para buscar os dados.
    const fetchProdutos = async () => {
        try {
            const data = await getProdutos();
            setProdutos(data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    // handleDeleteClick: função que exibe um toast de confirmação antes de excluir.
    const handleDeleteClick = (produto) => {
        toast(
            <div>
                <Typography>Tem certeza que deseja excluir o produto <strong>{produto.nome}</strong>?</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" color="error" size="small"
                        onClick={() => handleDeleteConfirm(produto.id_produto)} style={{ marginRight: '10px' }}
                    >Excluir</Button>
                    <Button variant="outlined" size="small" onClick={() => toast.dismiss()}>Cancelar</Button>
                </div>
            </div>,
            {
                position: "top-center", autoClose: false, closeOnClick: false, draggable: false, closeButton: false,
            }
        );
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await deleteProduto(id);
            fetchProdutos();
            toast.dismiss();
            toast.success('Produto excluído com sucesso!', { position: "top-center" });
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            toast.error('Erro ao excluir produto.', { position: "top-center" });
        }
    };

    return (
        //Adição do botão baixar cpf
        <TableContainer component={Paper}>
            <Toolbar sx={{ backgroundColor: "#092B38", padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="white">Produtos</Typography>
                <Button color="#804b0f" onClick={() => {}} startIcon={<PictureAsPdf />} sx={{color: 'white', transition:'0.7s', '&:hover': { backgroundColor: '#3D94B6', color:'black'}}}>
                    <PDFDownloadLink
                        document={<PdfProdutoList produtos={produtos} />}
                        fileName="produtos.pdf"
                        style={{
                            color: 'inherit',
                        }}
                    >
                        {({ loading }) =>
                            loading ? 'Preparando PDF...' : 'Baixar PDF'
                        }
                    </PDFDownloadLink>
                </Button>
                <Button color="white" onClick={() => navigate('/produto')} startIcon={<FiberNew />} sx={{color: 'white', transition:'0.7s', '&:hover': { backgroundColor: '#3D94B6', color:'black'}}}>Novo</Button>
            </Toolbar>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Valor</TableCell>
                        {/* conforme o tamanho da tela, define o que renderizar */}
                        {!isSmallScreen && (
                            <>
                                <TableCell>Foto</TableCell>
                                <TableCell>Descrição</TableCell>
                            </>
                        )}
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Mapeia a lista */}
                    {produtos.map((produto) => (
                        <TableRow key={produto.id_produto}>
                            <TableCell>{produto.id_produto}</TableCell>
                            <TableCell>{produto.nome}</TableCell>
                            <TableCell>{produto.valor_unitario}</TableCell>
                            {/* conforme o tamanho da tela, define o que renderizar */}
                            {!isSmallScreen && (
                                <>
                                    <TableCell>
                                        {/* Exibe a foto */}
                                        {produto.foto ? (
                                            <img src={produto.foto} alt={produto.nome} style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '8px' }} />
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">Sem foto</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{produto.descricao}</TableCell>
                                </>
                            )}
                            <TableCell>
                                {/* executa a rota, passando o opr view e o id selecionado */}
                                <IconButton onClick={() => navigate(`/produto/view/${produto.id_produto}`)}>
                                    <Visibility color="#804b0f" />
                                </IconButton>
                                {/* executa a rota, passando o opr edit e o id selecionado */}
                                <IconButton onClick={() => navigate(`/produto/edit/${produto.id_produto}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(produto)}>
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
export default ProdutoList;