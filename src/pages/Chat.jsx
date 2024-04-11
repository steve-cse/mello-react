import React, { useState, useRef, useEffect } from "react";
import Alert from '@mui/material/Alert';
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ScaleLoader from "react-spinners/ScaleLoader";
import { supabaseClient } from '../config/supabase';
import { useAuth } from "../contexts/AuthContext";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import StopIcon from '@mui/icons-material/Stop';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import Runpod from "../runpod/Runpod";
import Mello_Avatar from "../assets/mello_avatar.webp";
import "./Chat.css";
function Chat() {
    const drawerWidth = 240;
    const { session, user, signOut } = useAuth();
    const { text, startListening, stopListening, isListening, recognitionSupport } = useSpeechRecognition();
    const podAPI = Runpod();
    // required states
    const [selectedIndex, setSelectedIndex] = useState(null); // list selection state
    const [mobileOpen, setMobileOpen] = useState(false);
    const [chatUpdated, setChatUpdated] = useState(false);
    const [chatSynced, setChatSynced] = useState(true);
    const [openSettingsModal, setOpenSettingsModal] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertError, setAlertError] = useState("");
    const promptRef = useRef();
    const scrollRef = useRef(null);

    const [chatData, setChatData] = useState({
        history: [],
        messages: []
    });

    const [deletedialogopen, setDeleteDialogOpen] = useState(false);
    const handleOpenSettingsModal = () => {
        setOpenSettingsModal(true);
    };

    // Function to close the modal
    const handleCloseSettingsModal = () => {
        setOpenSettingsModal(false);
    };

    const handleDeleteDialogOpen = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };
    const [renamedialogopen, setRenameDialogOpen] = useState(false);

    const handleRenameDialogOpen = () => {
        setRenameDialogOpen(true);
    };

    const handleRenameDialogClose = () => {
        setRenameDialogOpen(false);
    };
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
    }, [chatData.messages]);

    useEffect(() => {

        pushChatDataToSupabase(chatData, user.id)

    }, [chatData]);
    useEffect(() => {
        promptRef.current.value = text


    }, [text]);
    // useEffect(() => {

    //     console.log("Listening: " + isListening)

    // }, [isListening]);

    // useEffect(() => { console.log("Selected Index changed to: " + selectedIndex) }, [selectedIndex])
    // useEffect(() => { console.log("Chat Synced changed to: " + chatSynced) }, [chatSynced])
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


    };
    useEffect(() => {
        // Fetch chat data from Supabase during initial component load
        async function fetchChatData() {
            try {
                // Fetch chat data based on the user's session or userID
                const fetchedData = await fetchChatDataFromSupabase(session.user.id);

                // Update the chatData state with fetched data
                if (fetchedData) {
                    setChatSynced(true) //avoid double sync
                    setChatData(fetchedData);
                    console.log("Chat fetched from supabase")
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error fetching chat data:', error);
                setAlertError('Error fetching chat data from Supabase')
            }
        }

        // Call the fetchChatData function when the component mounts
        fetchChatData();
        setSelectedIndex(0)

    }, []);
    async function fetchChatDataFromSupabase(supabaseUID) {
        try {
            const { data, error } = await supabaseClient
                .from('chatdata')
                .select()
                .eq('supabase_uid', supabaseUID)
                .single(); // Assuming each user has only one entry in the ChatData table

            if (error) {
                throw error;
            }

            if (data) {
                // If data exists, populate the chatData object
                const chatData = {
                    history: data.history,
                    messages: data.messages
                };

                return chatData;
            } else {
                // If no data found for the user, return null or handle accordingly
                return null;
            }
        } catch (error) {
            console.error('Error fetching chat data from Supabase:', error.message);
            setAlertError('Error fetching chat data from Supabase')
            throw error;
        }
    }
    async function handleExport(supabaseUID) {
        console.log("Start Download")
        try {
            const { data, error } = await supabaseClient
                .from('chatdata')
                .select('supabase_uid, history, messages, created_at')
                .eq('supabase_uid', supabaseUID)
                .csv();

            if (error) {
                throw error;
            }
            const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
            let file = URL.createObjectURL(blob)
            let a = document.createElement('a');
            a.download = 'mello_exported_chats.csv';
            a.href = file;
            a.click();
        } catch (error) {
            console.error('Error downloading CSV:', error.message);
            setAlertError('Error downloading CSV')
        }
    }
    const handleSend = async (event, message) => {
        event.preventDefault()

        if (chatData.history.length === 0) {
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
        const newMessages = structuredClone(chatData.messages); //create a deep copy

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


        console.log(chatData)
        await processMessageToMelloGPT(newMessages);
    };

    async function processMessageToMelloGPT(chatMessages) {
        if (podAPI !== "No Running Pods") {
            setIsTyping(true)
            try {
                let apiMessages = chatMessages[selectedIndex || 0].map((messageObject) => {
                    let role = messageObject.sender === "MelloGPT" ? "assistant" : "user";
                    return { role: role, content: messageObject.message }
                });
                const apiRequestBody = {
                    "model": "steve-cse/MelloGPT",
                    "temperature": 0.4,
                    "messages": [...apiMessages]
                }

                const response = await fetch(podAPI, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(apiRequestBody)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();


                const updatedMessages = [...chatMessages];

                updatedMessages[selectedIndex || 0].push({
                    message: data.choices[0].message.content,
                    sender: "MelloGPT"
                });

                setChatData(prevData => ({
                    ...prevData,
                    messages: updatedMessages
                }));
                setIsTyping(false)
                setChatSynced(false)
            } catch (error) {
                console.error('API Error:', error);
                setAlertError('API Error: ' + error.message)
                setChatSynced(true)
                setIsTyping(false)

            }
        } else {
            setAlertError("API Error: Server not Running")
            setChatSynced(true)
        }
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
    const handleDeleteChat = async (index) => {
        try {
            const updatedHistory = [...chatData.history];
            updatedHistory.splice(index, 1); // Remove the chat from history

            const updatedMessages = [...chatData.messages];
            updatedMessages.splice(index, 1); // Remove the messages for the chat

            // Update chatData with the updated history and messages
            setChatData((prevData) => ({
                ...prevData,
                history: updatedHistory,
                messages: updatedMessages,
            }));
            setSelectedIndex(0)
            setChatSynced(false)
        } catch (error) {
            console.error('Error deleting chat:', error);
            setAlertError('Error deleting chat')
        }
    };

    async function pushChatDataToSupabase(chatData, supabaseUID) {
        if (chatSynced === false) {
            setChatSynced(true)
            try {

                const { data, error } = await supabaseClient
                    .from('chatdata')
                    .update({
                        history: chatData.history,
                        messages: chatData.messages
                    })
                    .eq("supabase_uid", supabaseUID)

                if (error) {
                    throw error;
                }

                console.log('Chat data inserted successfully:', data);

                return data;
            } catch (error) {
                console.error('Error inserting chat data:', error.message);
                setAlertError('Error inserting chat data')
                throw error;
            }
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
                    <IconButton onClick={handleOpenSettingsModal} >
                        <SettingsIcon />
                    </IconButton>
                    <IconButton href="https://github.com/harsh-uiux/Mental-Health-Chatbot" target="_blank" rel="noopener noreferrer">
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
                <Button variant="contained" sx={{ m: 2 }} startIcon={<AddIcon />} disabled={loading} onClick={handleNewChat}>
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


                                    <MenuItem onClick={async () => { console.log("Renamed Chat"); handleRenameDialogOpen(); handleClose(); }} >Rename</MenuItem>
                                    <MenuItem onClick={async () => { console.log("Deleted"); handleDeleteDialogOpen(); handleClose(); }} >Delete</MenuItem>

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
                <Button variant="contained" sx={{ m: 2 }} startIcon={<AddIcon />} disabled={loading} onClick={handleNewChat}>
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

                                    <MenuItem onClick={async () => { console.log("Renamed Chat"); handleRenameDialogOpen(); handleClose(); }} >Rename</MenuItem>
                                    <MenuItem onClick={async () => { console.log("Deleted"); handleDeleteDialogOpen(); handleClose(); }} >Delete</MenuItem>

                                </Menu>
                            </ListItemButton>
                        </ListItem>

                    ))}

                </List>

            </Drawer>
            <Dialog
                PaperProps={{ elevation: 1 }}
                open={deletedialogopen}
                onClose={handleDeleteDialogClose}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete chat?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will delete the chat: {chatData.history[selectedIndex]}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mr: 1 }}>
                    <Button variant="contained" onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={async () => { await handleDeleteChat(selectedIndex); handleDeleteDialogClose(); }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={renamedialogopen}
                onClose={handleRenameDialogClose}
                PaperProps={{
                    elevation: 1,
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());

                        try {
                            const updatedHistory = [...chatData.history];
                            updatedHistory[selectedIndex] = formJson.new_name;

                            setChatData((prevData) => ({
                                ...prevData,
                                history: updatedHistory,
                            }));

                            setChatSynced(false)
                        } catch (error) {
                            console.error('Error renaming chat:', error);
                            setAlertError('Error renaming chat')
                        }
                        handleRenameDialogClose();
                    },
                }}
            >
                <DialogTitle>Rename this chat</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You're about to rename this chat. Choose a new name that reflects
                        the conversation's focus or purpose.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Enter New Name"
                        fullWidth
                        variant="standard"
                        name="new_name"
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleRenameDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        Rename
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%", }}>

                <Box component={Paper} elevation={0} sx={{ flexGrow: 1, p: 1, overflowY: "auto" }}>

                    {loading ? (

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <div>
                                <ScaleLoader size={"150"} color={"#6200EE"} loading={loading} />
                            </div>
                        </div>


                    ) : (<>
                        <Toolbar />

                        {chatData.messages[selectedIndex] && chatData.messages[selectedIndex].length > 0 ? (

                            chatData.messages[selectedIndex].map((message, index) => (
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
                                                src={Mello_Avatar}
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
                                    {message.sender === "user" && <Avatar sx={{ bgcolor: '#ff4569', mr: 1 }} >{user.email.charAt(0).toUpperCase()}</Avatar>}

                                </Box>
                            ))) : (
                            // If messages array is empty, display an <h1> tag with the text "Help"
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center', height: '75vh', width: '100%' }}>

                                <h2 style={{ textAlign: 'center' }}>How can I empower you today?<br />😊 </h2>

                            </div>
                        )}
                        <div ref={scrollRef}></div>
                    </>
                    )}
                </Box>


                {alertError && <Alert severity="error" onClose={() => { setAlertError("") }}>{alertError}</Alert>}


                {isTyping && <div style={{ marginLeft: 23, marginBottom: -11 }}>Mindflow is typing<span className="blink">....</span> </div>}

                <form onSubmit={(event) => { handleSend(event, promptRef.current.value) }}>
                    <Box display="flex" alignItems="center" sx={{ p: 2 }}>
                        <TextField
                            required
                            fullWidth
                            disabled={loading}
                            autoComplete="off"
                            placeholder="Type a message"
                            inputRef={promptRef}
                            sx={{ mr: 1 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">

                                        {recognitionSupport ? (
                                            isListening ? (
                                                <IconButton aria-label="stop listening" onClick={stopListening}>
                                                    <StopIcon />
                                                </IconButton>
                                            ) : (
                                                <IconButton disabled={loading} aria-label="start listening" onClick={startListening}>
                                                    <MicIcon />
                                                </IconButton>
                                            )
                                        ) : null}
                                        <IconButton type="submit" disabled={loading} sx={{ mr: -2 }}>
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 4 },
                            }}
                        />

                    </Box>
                </form>
            </Box>

            {/* Settings Modal */}
            <Dialog PaperProps={{ elevation: 1 }} open={openSettingsModal} onClose={handleCloseSettingsModal}>
                <DialogTitle>Account Settings</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseSettingsModal}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,

                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <DialogContentText>Syncing to: {user.email}</DialogContentText>

                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center' }}>

                    <Button variant="contained" sx={{ mb: 2 }} onClick={() => { signOut(); }}>
                        Logout
                    </Button>

                </DialogActions>
                <DialogTitle>Chat Settings</DialogTitle>
                <DialogContent>

                    <DialogContentText>Export your chats to CSV </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>

                    <Button variant="contained" sx={{ mb: 2 }} onClick={() => { handleExport(user.id); }}>
                        Export
                    </Button>

                </DialogActions>
            </Dialog>

        </Box>
    )
}

export default Chat
