import { FC, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import NewStory from "./pages/NewStory";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi'
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from "@mui/icons-material/Dashboard";
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from "@mui/material/Tooltip";
import MediumLogo from "./assets/logo.svg";
import HomeIcon from '@mui/icons-material/Home';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import InsightsIcon from '@mui/icons-material/Insights';
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    
    boxSizing: 'border-box',
    
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const App: FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { signMessageAsync } = useSignMessage();
  const { isConnected,address } = useAccount({
    onConnect: async ({ address, isReconnected }) => {
      if (address && !isReconnected) {
        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND}/requestAuth`,
          { address }
          , {
            headers: {
              'content-type': 'application/json',
            },
          });

        const message = data?.message;

        const signature = await signMessageAsync({ message });

        await axios.post(`${process.env.REACT_APP_BACKEND}/verifyAuth`,
          { message, signature }
          , {
            headers: {
              'content-type': 'application/json',
            },
          });

      }
    }
  });

  /**
   * @description Handle opening and closing Drawer (Sidebar) component
   */
  const handleDrawerOpen = () => {
    setOpen((o) => !o);
  };

  return (
    <>
      <Box sx={{ display: 'flex',color:'#0B0D21'}}>
        <CssBaseline />
        <AppBar style={{backgroundColor:'#0B0D21'}} position="fixed" open={open} elevation={1}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 3,color:'white' }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <img src={"https://theuniverse.mypinata.cloud/ipfs/QmUaVqSjqrsKQUjzCReiqXpxVXCiVXVNkVVBubeDt7Sr4k"} alt="logo" width="160px" height="auto" />
          
            <Box sx={{ flexGrow: 1 }} />
            <ConnectButton />
          </Toolbar>
        </AppBar>
        <Drawer  style={{borderColor:'#0B0D21'}}  variant="permanent" open={open}>
          <DrawerHeader   />
          <Divider  />
          <List dense={true}  style={{background:'linear-gradient(to right bottom, #0B0D21, white)' ,height:'100%',padding:0}} >
            {[ { title: "Home", icon: HomeIcon, link: "/" },
            { title: "DEFI", icon: InsightsIcon, link: "/defi" },
            { title: "DAO", icon: ThumbsUpDownIcon, link: "/dao" },
            { title: "Blog", icon: DashboardIcon, link: "/dashboard" },
              (isConnected && isConnected &&{ title: "New Story", icon: EditIcon, link: "/write" })
              // @ts-ignore
            ].filter(Boolean).map(({ title, icon: Icon, link }) => {
              return (
                <Tooltip  title={title} key={title} placement="right">
                  <ListItem key={title} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      onClick={() => pathname !== link && navigate(link)}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon
                          color={pathname === link ? "primary" : "inherit"}
                        />
                      </ListItemIcon>
                      <ListItemText primary={title} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              )
            })}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 7 }}>
          <DrawerHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {isConnected &&address==="0xFD0C28Bb919780A03CF471974a65f5d5BC2Ba4A82"&& <Route path="/write" element={<NewStory />} />}
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default App;
