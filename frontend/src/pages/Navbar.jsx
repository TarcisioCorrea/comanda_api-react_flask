// incluído IconButton e useMediaQuery
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// icones utilizados na navbar
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";

// styles do mui
import { useTheme } from "@mui/material/styles";

const Navbar = () => {
  // useNavigate é um hook do React Router que permite programaticamente navegar entre rotas
  const navigate = useNavigate();

  // useAuth é um hook personalizado que fornece acesso ao contexto de autenticação
  // logouut é uma função que realiza o logout do usuário
  // isAuthenticated é um booleano que indica se o usuário está autenticado ou não
  const { isAuthenticated, logout } = useAuth();

  // Hook para detectar o tamanho da tela
  const theme = useTheme();

  // Aqui, estamos verificando se a tela é menor ou igual ao breakpoint 'sm' definido no tema
  // O valor 'sm' é definido no tema do Material-UI e representa um breakpoint específico (geralmente 600px)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Chama a função de logout do contexto de autenticação
  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#092B38" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Comandas
        </Typography>
        {/* Renderiza os botões de navegação apenas se o usuário estiver autenticado */}
        {isAuthenticated && (
          <>
            {/* conforme o tamanho da tela, define o que renderizar */}
            {isSmallScreen ? (
              <IconButton color="inherit" onClick={() => navigate("/home")} >
                {" "}
                <HomeIcon />{" "}
              </IconButton>
            ) : (
              <Button
                color="inherit"
                startIcon={<HomeIcon />}
                onClick={() => navigate("/home")}
                sx={{'&:hover': { backgroundColor: '#3D94B6', color:'black'}, transition:'0.7s'}}
              >
                Home
              </Button>
            )}
            {isSmallScreen ? (
              <IconButton
                color="inherit"
                onClick={() => navigate("/funcionarios")}
              >
                {" "}
                <PeopleIcon />{" "}
              </IconButton>
            ) : (
              <Button
                color="inherit"
                startIcon={<PeopleIcon />}
                onClick={() => navigate("/funcionarios")}
                sx={{'&:hover': { backgroundColor: '#3D94B6', color:'black'}, transition:'0.7s'}}
              >
                Funcionários
              </Button>
            )}
            {isSmallScreen ? (
              <IconButton color="inherit" onClick={() => navigate("/clientes")}>
                {" "}
                <PersonIcon />{" "}
              </IconButton>
            ) : (
              <Button
                color="inherit"
                startIcon={<PersonIcon />}
                onClick={() => navigate("/clientes")}
                sx={{'&:hover': { backgroundColor: '#3D94B6', color:'black'}, transition:'0.7s'}}
              >
                Clientes
              </Button>
            )}
            {isSmallScreen ? (
              <IconButton color="inherit" onClick={() => navigate("/produtos")}>
                {" "}
                <ShoppingCartIcon />{" "}
              </IconButton>
            ) : (
              <Button
                color="inherit"
                startIcon={<ShoppingCartIcon />}
                onClick={() => navigate("/produtos")}
                sx={{'&:hover': { backgroundColor: '#3D94B6', color:'black'}, transition:'0.7s'}}
              >
                Produtos
              </Button>
            )}
            {isSmallScreen ? (
              <IconButton color="inherit" onClick={handleLogout}>
                {" "}
                <LogoutIcon />{" "}
              </IconButton>
            ) : (
              <Button
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{'&:hover': { backgroundColor: '#3D94B6', color:'black'}, transition:'0.7s'}}
              >
                Sair
              </Button>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;