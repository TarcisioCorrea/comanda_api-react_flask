import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import IMaskInputWrapper from "../components/IMaskInputWrapper";
import {
  createFuncionario,
  updateFuncionario,
  getFuncionarioById,
  checkCpfExist, // Importe o novo método
} from "../services/funcionarioService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const FuncionarioForm = () => {
  const { id, opr } = useParams();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [existingFuncionarioId, setExistingFuncionarioId] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm();

  const isReadOnly = opr === "view";

  let title;
  if (opr === "view") {
    title = `Visualizar Funcionário: ${id}`;
  } else if (id) {
    title = `Editar Funcionário: ${id}`;
  } else {
    title = "Novo Funcionário";
  }

  const validateCpf = async (cpf) => {
    if (!cpf) return true;

    try {
      const { exists, existingId } = await checkCpfExist(cpf, id);

      if (exists) {
        setExistingFuncionarioId(existingId);
        setOpenDialog(true);
        return "CPF já cadastrado";
      }
      return true;
    } catch (error) {
      console.error("Erro na validação do CPF:", error);
      return "Erro ao validar CPF";
    }
  };

  // useEffect: usado para executar efeitos colaterais, como buscar dados do backend ou atualizar o estado do componente.
  // useEffect é um hook que permite executar efeitos colaterais em componentes funcionais.
  // Ele recebe uma função de efeito e um array de dependências como argumentos.
  // A função de efeito é executada após a renderização do componente e
  // pode retornar uma função de limpeza que é executada antes da próxima execução do efeito ou da desmontagem do componente.
  // A dependência id é usada para buscar os dados do funcionário a ser editado ou visualizado.
  useEffect(() => {
    if (id) {
      // define uma função assíncrona para buscar os dados do funcionário pelo id.
      const fetchFuncionario = async () => {
        const data = await getFuncionarioById(id);
        // O reset é uma função do react-hook-form que redefine os valores do formulário,
        // no caso, para os valores retornados da consulta.
        reset(data);
      };
      // Chama a função fetchFuncionario para buscar os dados do funcionário.
      fetchFuncionario();
    }
  }, [id, reset]);

  // onSubmit: função chamada quando o formulário é enviado. Ela recebe os dados do formulário como argumento.
  // A função onSubmit verifica se o id está presente. Se estiver, chama a função updateFuncionario para atualizar os dados do funcionário.
  // Caso contrário, chama a função createFuncionario para criar um novo funcionário.
  // Após a operação, navega para a página de funcionários.
  const onSubmit = async (data) => {
    try {
      let retorno;
      if (id) {
        retorno = await updateFuncionario(id, data);
      } else {
        retorno = await createFuncionario(data);
      }
      // a api, nos casos de sucesso, retorna um objeto com a propriedade id.
      if (!retorno || !retorno.id) {
        // a api, nos casos de erro, retorna um objeto com a propriedade erro.
        throw new Error(retorno.erro || "Erro ao salvar funcionário.");
      }
      toast.success(`Funcionário salvo com sucesso. ID: ${retorno.id}`, {
        position: "top-center",
      });
      navigate("/funcionarios");
    } catch (error) {
      toast.error(`Erro ao salvar funcionário: \n${error.message}`, {
        position: "top-center",
      });
    }
  };

  return (
    // O Box é um componente do Material-UI que pode ser usado como um contêiner flexível para outros componentes.
    // O component="form" indica que o Box deve ser tratado como um elemento de formulário HTML.
    // O onSubmit é uma função que será chamada quando o formulário for enviado.
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ backgroundColor: "#AAE7FF", padding: 2, borderRadius: 1, mt: 2 }}
    >
      <Toolbar
        sx={{
          backgroundColor: "#092B38",
          padding: 1,
          borderRadius: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" gutterBottom color="white">
          {title}
        </Typography>
      </Toolbar>
      <Box
        sx={{ backgroundColor: "white", padding: 2, borderRadius: 3, mb: 2 }}
      >
        {opr === "view" && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Todos os campos estão em modo somente leitura.
          </Typography>
        )}
        <Controller
          name="nome"
          control={control}
          defaultValue=""
          rules={{ required: "Nome é obrigatório" }}
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
          rules={{
            required: "CPF é obrigatório",
            validate: validateCpf,
          }}
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isReadOnly}
              label="CPF"
              fullWidth
              margin="normal"
              error={!!errors.cpf}
              helperText={errors.cpf?.message}
              onBlur={() => !isReadOnly && trigger("cpf")}
              InputProps={{
                inputComponent: IMaskInputWrapper,
                inputProps: {
                  mask: "000.000.000-00",
                  definitions: { 0: /\d/ },
                  unmask: true,
                },
              }}
            />
          )}
        />

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>CPF já cadastrado</DialogTitle>
          <DialogContent>
            <Typography>
              Já existe um funcionário com este CPF cadastrado.
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Escolha uma ação:
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                navigate(`/funcionario/view/${existingFuncionarioId}`);
                setOpenDialog(false);
              }}
              color="primary"
            >
              Visualizar
            </Button>
            <Button
              onClick={() => {
                navigate(`/funcionario/edit/${existingFuncionarioId}`);
                setOpenDialog(false);
              }}
              color="primary"
            >
              Editar
            </Button>
          </DialogActions>
        </Dialog>
        <Controller
          name="matricula"
          control={control}
          defaultValue=""
          rules={{ required: "Matrícula é obrigatória" }}
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isReadOnly}
              label="Matrícula"
              fullWidth
              margin="normal"
              error={!!errors.matricula}
              helperText={errors.matricula?.message}
            />
          )}
        />
        <Controller
          name="telefone"
          control={control}
          defaultValue=""
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
                  definitions: {
                    0: /\d/,
                  },
                  unmask: true,
                },
              }}
            />
          )}
        />
        <Controller
          name="senha"
          control={control}
          defaultValue=""
          rules={{
            required: "Senha obrigatória",
            minLength: { value: 6, message: "Pelo menos 6 caracteres" },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isReadOnly}
              label="Senha"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.senha}
              helperText={errors.senha?.message}
              inputProps={{
                autoComplete: "new-password",
              }}
            />
          )}
        />
        <Controller
          name="grupo"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel id="grupo-label">Grupo</InputLabel>
              <Select
                {...field}
                disabled={isReadOnly}
                label="Grupo"
                labelId="grupo-label"
              >
                <MenuItem value="1">Admin</MenuItem>
                <MenuItem value="2">Atendimento Balcão</MenuItem>
                <MenuItem value="3">Atendimento Caixa</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={() => navigate("/funcionarios")} sx={{ mr: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#092B38', transition: '1s', '&:hover': { backgroundColor: '#004561', color: 'white' } }}>
            Cancelar
          </Button>
          {opr !== "view" && (
            <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor: '#092B38', '&:hover': { backgroundColor: '#004561' }, border: 'none', outline: 'none', transition: '1s' }}>
              {id ? "Atualizar" : "Cadastrar"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FuncionarioForm;
