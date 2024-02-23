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
import FormControl from '@mui/material/FormControl';
import OpenAI from 'openai';
function Guest() {
    const drawerWidth = 240;
    // required states
    const [selectedIndex, setSelectedIndex] = useState(null); // list selection state
    const [mobileOpen, setMobileOpen] = useState(false);
    const [chatUpdated, setChatUpdated] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const promptRef = useRef();
    const scrollRef = useRef(null);
    const [chatData, setChatData] = useState({
        history: [],
        messages: []
    });
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
    }, [chatData.messages]);

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

    const handleSend = async (event, message) => {
        event.preventDefault()
        if (selectedIndex === null && chatData.history.length === 0) {
            setSelectedIndex(0)
            setChatData(prevData => ({
                ...prevData,
                history: [message]
            }));
        }

        if (!chatUpdated && chatData.history[selectedIndex] === "New Chat") {
            const updatedHistory = [...chatData.history]; // Create a copy of the history array
            updatedHistory[selectedIndex] = message; // Replace the value at selectedIndex with message        
            setChatData(prevData => ({
                ...prevData,
                history: updatedHistory
            }));
            setChatUpdated(true)
        }

        const newMessage = {
            message,
            sender: "user"
        };

        promptRef.current.value = ''

        // Update messages array with the new message
        const newMessages = [...chatData.messages];

        // Check if the array at index 0 exists, if not, create it
        if (!newMessages[selectedIndex || 0]) {
            newMessages[selectedIndex || 0] = [];
        }


        // Add the new message to the messages array of the selected history
        newMessages[selectedIndex || 0].push(newMessage);
        // Update chatData with the updated messages array
        setChatData(prevData => ({
            ...prevData,
            messages: newMessages,
        }));

        // const newMessages = [...chatData.messages, newMessage];
        // setChatData(prevData => ({
        //     ...prevData,
        //     messages: newMessages
        // }));
        console.log(chatData)
        await processMessageToMelloGPT(newMessages);
    };

    async function processMessageToMelloGPT(chatMessages) {
        let apiMessages = chatMessages[selectedIndex || 0].map((messageObject) => {
            let role = messageObject.sender === "MelloGPT" ? "assistant" : "user";
            return { role: role, content: messageObject.message }
        });
        console.log("API messages: ")
        console.log(apiMessages)
        const apiRequestBody = {
            "model": "TheBloke/MelloGPT-AWQ",
            "temperature": 0.3,
            "messages": [...apiMessages]
        }

        await fetch("https://5i0p4d239zd0mg-8000.proxy.runpod.net/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data)
            const updatedMessages = [...chatMessages];
            console.log(updatedMessages)
            updatedMessages[selectedIndex || 0].push({
                message: data.choices[0].message.content,
                sender: "MelloGPT"
            });

            setChatData(prevData => ({
                ...prevData,
                messages: updatedMessages
            }));
        });
    }

    const handleNewChat = () => {
        if (chatData.messages[selectedIndex] && chatData.messages[selectedIndex].length === 0) {
            console.log("New Chat already exists")
        } else {
            // Clone the current messages array
            const newMessages = [...chatData.messages];

            // Insert a new empty array at the beginning for the new chat session
            newMessages.unshift([]);

            // Create a new chat session with the current history and updated messages
            const newChatData = {
                history: ["New Chat", ...chatData.history],
                messages: newMessages,
            };
            setChatData(newChatData);
            // setChatData(prevData => ({
            //     history: ["New Chat", ...prevData.history],
            //     messages: [[],chatData.messages],
            // }));
            setSelectedIndex(0);
            setChatUpdated(false)
        }
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
                <Button variant="contained" sx={{ m: 2 }} startIcon={<AddIcon />} onClick={handleNewChat}>
                    New Chat
                </Button>
                <List>
                    {chatData.history.map((text, index) => (
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
                <Button variant="contained" sx={{ m: 2 }} startIcon={<AddIcon />} onClick={handleNewChat}>
                    New Chat
                </Button>

                <List>
                    {chatData.history.map((text, index) => (
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
                <Box component={Paper} elevation={0} sx={{ flexGrow: 1, p: 1, overflowY: "auto" }}>
                    <Toolbar />
                    {chatData.messages[selectedIndex] && chatData.messages[selectedIndex].map((message, index) => (
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
                    <div ref={scrollRef}></div>
                </Box>
                <form onSubmit={(event) => { handleSend(event, promptRef.current.value) }}>
                    <Box display="flex" alignItems="center" sx={{ p: 2 }}>
                        <TextField
                            fullWidth
                            autoComplete="off"
                            placeholder="Type a message"
                            inputRef={promptRef}
                            sx={{ mr: 1 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton aria-label="speak" onClick={() => { console.log(chatData.messages[selectedIndex]) }}>
                                            <MicIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 4 },
                            }}
                        />
                        <IconButton type="submit">
                            <SendIcon />
                        </IconButton>
                    </Box>
                </form>
            </Box>

        </Box>
    )
}

export default Guest