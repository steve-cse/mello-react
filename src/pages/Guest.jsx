import React, { useState, useRef, useEffect } from "react";
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
import StyledBadge from "../components/StyledBadge";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OpenAI from 'openai';
function Guest() {
    const drawerWidth = 240;
    // required states
    const [selectedIndex, setSelectedIndex] = useState(null); // list selection state
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const promptRef = useRef();
    const [messages, setMessages] = useState([]);
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null)
    };

    const handleSend = async (message) => {
        const newMessage = {
            message,
            sender: "user"
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);



        await processMessageToChatGPT(newMessages);
    };

    async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
        // Format messages for chatGPT API
        // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
        // So we need to reformat

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "MelloGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            console.log(messageObject)
            return { role: role, content: messageObject.message }
        });


        const apiRequestBody = {
            "model": "TheBloke/MelloGPT-AWQ",
            "temperature": 0.3,
            "messages": [...apiMessages]
        }

        await fetch("https://dummy.net/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                console.log(data.choices[0].message.content);
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "MelloGPT"
                }]);
                console.log(messages)
            });
    }


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

                            key={index}
                            disablePadding
                        >
                            <ListItemButton
                                disableRipple
                                selected={selectedIndex === index}
                                onClick={(event) => handleListItemClick(event, index)}
                            >
                                <ListItemText primary={text} />
                                <IconButton edge="end" onClick={handleClick}>
                                    <MoreHorizIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open && selectedIndex === index}
                                    onClose={handleClose}
                                >

                                    <MenuItem>Download</MenuItem>
                                    <MenuItem>Rename</MenuItem>
                                    <MenuItem >Delete</MenuItem>

                                </Menu>
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

                <List>
                    {[
                        "Previous Chat 1",
                        "Previous Chat 2",
                        "Previous Chat 3",
                        "Previous Chat 5",
                    ].map((text, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                disableRipple
                                selected={selectedIndex === index}
                                onClick={(event) => handleListItemClick(event, index)}
                            >
                                <ListItemText primary={text} />
                                <IconButton edge="end" onClick={handleClick}>
                                    <MoreHorizIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open && selectedIndex === index}
                                    onClose={handleClose}
                                >

                                    <MenuItem>Download</MenuItem>
                                    <MenuItem>Rename</MenuItem>
                                    <MenuItem >Delete</MenuItem>

                                </Menu>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%", }}>
                <Box component={Paper} elevation={0} sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
                    <Toolbar />
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            justifyContent={message.sender === "user" ? "flex-end" : "flex-start"}
                        >
                            {message.sender !== "user" && (
                                <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    variant="dot"
                                >
                                    <Avatar
                                        sx={{ ml: 1 }}
                                        alt="mello_avatar"
                                        src="/mello_avatar.webp"
                                    />
                                </StyledBadge>
                            )}

                            <Typography
                                paragraph={true}
                                sx={{
                                    backgroundColor: message.sender === "user" ? "#6200EE" : "#d1d5db",
                                    color: message.sender === "user" ? "#FFFFFF" : "#000000",
                                    borderRadius: "19px",
                                    padding: "10px",
                                    maxWidth: "100%",
                                    margin: "10px",
                                }}
                            >
                                {message.message}
                            </Typography>
                            {message.sender === "user" && <Avatar sx={{ mr: 1 }}>U</Avatar>}
                        </Box>
                    ))}
                </Box>
                <Box display="flex" alignItems="center" sx={{ p:2  }}>
                    <TextField
                        fullWidth
                        placeholder="Type a message"
                        inputRef={promptRef}
                        sx={{ mr: 1}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <IconButton aria-label="speak">
                                        <MicIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 4 },
                        }}
                    />
                    <IconButton onClick={() => handleSend(promptRef.current.value)}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>

        </Box>
    )
}

export default Guest