import React, { useState } from "react";
import ChatMessages from "../components/ChatMessages";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AddIcon from "@mui/icons-material/Add";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import InputAdornment from "@mui/material/InputAdornment";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import Paper from "@mui/material/Paper";
const drawerWidth = 240;
export default function ResponsiveDrawer() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        color="default"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Mello
          </Typography>
          <IconButton href="https://github.com/steve-cse/mello-react">
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
          display: { xs: "block", sm: "none" },
        }}
        PaperProps={{ elevation: 1 }}
      >
        <Toolbar />
        <Button variant="contained" sx={{ m: 2 }} startIcon={<AddIcon />}>
          New Chat
        </Button>
        <List>
          {[
            "Previous Chat 1",
            "Previous Chat 2",
            "Previous Chat 3",
            "Previous Chat 4",
          ].map((text, index) => (
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="more">
                  <MoreHorizIcon />
                </IconButton>
              }
              key={text}
              disablePadding
              
            >
              <ListItemButton
              disableRipple
                selected={selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index)}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
          display: { xs: "none", sm: "block" },
        }}
        PaperProps={{ elevation: 1 }}
      >
        <Toolbar />
        <Button variant="contained" sx={{ m: 2 }} startIcon={<AddIcon />}>
          New Chat
        </Button>

        <List >
          {[
            "Previous Chat 1",
            "Previous Chat 2",
            "Previous Chat 3",
            "Previous Chat 5",
          ].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                disableRipple
                selected={selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index)}
              >
                <ListItemText primary={text} />
                <IconButton edge="end">
                  <MoreHorizIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component={Paper} elevation={1} sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar />
        {ChatMessages.map((message, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent={message.user ? "flex-end" : "flex-start"}
          >
            {!message.user && (
              <Avatar
                sx={{ ml: 1 }}
                alt="mello_avatar"
                src="/mello_avatar.webp"
              >
                B
              </Avatar>
            )}

            <Typography
              paragraph={true}
              sx={{
                backgroundColor: message.user ? "#6200EE" : "#d1d5db",
                color: message.user ? "#FFFFFF" : "#000000",
                borderRadius: "19px",
                padding: "10px",
                maxWidth: "100%",
                margin: "10px",
              }}
            >
              {message.text}
            </Typography>
            {message.user && <Avatar sx={{ mr: 1 }}>U</Avatar>}
          </Box>
        ))}

        <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            sx={{ mr: 1 }}
            // InputProps={{ sx: { borderRadius: 4 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton aria-label="speak">
                    <MicIcon />
                  </IconButton>
                </InputAdornment>
              ),
              style: { borderRadius: 15 },
            }}
          />
          <IconButton>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
