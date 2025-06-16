import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
import { getClienteById, createCliente, updateCliente } from '../services/clienteService';

const ClienteForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const isReadOnly = opr === 'view';

    let title;
    if (opr === 'view') {
        title = `Visualizar Cliente: ${id}`;
    } else if (id) {
        title = `Editar Cliente: ${id}`;
    } else {
        title = "Novo Cliente";
    }

    useEffect(() => {
        if (id) {
            const fetchCliente = async () => {
                const data = await getClienteById(id);
                reset(data);
            };
            fetchCliente();
        }
    }, [id, reset]);

    const onSubmit = async (data) => {
        try {
            let retorno;
            if (id) {
                retorno = await updateCliente(id, data);
            } else {
                retorno = await createCliente(data);
            }

            if (!retorno?.id) {
                throw new Error(retorno.erro || "Erro ao salvar cliente.");
            }
            toast.success(`Cliente salvo com sucesso. ID: ${retorno.id}`, { position: "top-center" });
            navigate('/clientes');
        } catch (error) {
            toast.error(`Erro ao salvar cliente: \n${error.message}`, { position: "top-center" });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: "#AAE7FF", padding: 2, borderRadius: 1, mt: 2 }}>
            <Toolbar sx={{ backgroundColor: "#092B38", padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom color="white">{title}</Typography>
            </Toolbar>
            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>
                {opr === 'view' && (
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Todos os campos estão em modo somente leitura.
                    </Typography>
                )}
                <Controller
                    name="nome"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Nome é obrigatório", maxLength: { value: 100, message: "Nome deve ter no máximo 100 caracteres" } }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Nome"
                            fullWidth
                            margin="normal"
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                        />
                    )}
                />
                <Controller
                    name="cpf"
                    control={control}
                    defaultValue=""
                    rules={{ required: "CPF é obrigatório", maxLength: { value: 14, message: "CPF deve ter 11 dígitos" } }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="CPF"
                            fullWidth
                            margin="normal"
                            error={!!errors.cpf}
                            helperText={errors.cpf?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "000.000.000-00",
                                    definitions: { 0: /[0-9]/ },
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />
                <Controller
                    name="telefone"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Telefone é obrigatório" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            disabled={isReadOnly}
                            label="Telefone"
                            fullWidth
                            margin="normal"
                            error={!!errors.telefone}
                            helperText={errors.telefone?.message}
                            InputProps={{
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "(00) 00000-0000",
                                    definitions: { 0: /[0-9]/ },
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button onClick={() => navigate('/clientes')} sx={{ mr: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#092B38', transition: '1s', '&:hover': { backgroundColor: '#004561', color: 'white' } }}>Cancelar</Button>
                    {opr !== 'view' && (
                        <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor: '#092B38', '&:hover': { backgroundColor: '#004561' }, border: 'none', outline: 'none', transition: '1s' }}>{id ? "Atualizar" : "Cadastrar"}</Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ClienteForm;