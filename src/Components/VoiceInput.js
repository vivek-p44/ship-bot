import React, { useState, useEffect, useRef } from 'react';
import getUnifiedPrompt from './shipment_payload_generation_prompt';
import getTlPrompt from './tl_payload_generation_prompt';
import { TextField, Box, Paper, Button, IconButton, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyAqPFUB4MdQILFmdMCOdeDD-g08GFY8sw4");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

const VoiceInput = () => {
    const [inputValue, setInputValue] = useState('');
    const [listening, setListening] = useState(false);
    const [mode, setMode] = useState('');
    const recognitionRef = useRef(null);
    const modes = ['Ocean D2D', 'Ocean P2P', 'TL'];
    const [shipmentList, setShipmentList] = useState([]);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.error('Speech recognition not supported in this browser.');
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
        };
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
        recognition.onend = () => {
            setListening(false);
        };
        recognitionRef.current = recognition;
    }, []);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) return;
        if (listening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setListening(!listening);
    };

    const handleSend = async () => {
        const now = new Date();
        const currentDate = now.toISOString().slice(0, 19); // Get "YYYY-MM-DDTHH:mm:ss"

        console.log('Message sent:', inputValue, 'Mode:', mode, 'Date:', currentDate);

        let prompt = getUnifiedPrompt(inputValue);
        let url = 'http://localhost:5050/proxy/unified/shipment'
        if (mode === 'TL') {
            prompt = getTlPrompt(inputValue, currentDate);
            url = 'http://localhost:5050/proxy/tl/shipment';
        }

        try {
            const result = await model.generateContent(prompt, {
                responseMimeType: 'application/json',
            });
            const response = await result.response;
            const text = await response.text();
            console.log('Json:', text);
            const filteredText = text.replace(/```json\n|```/g, '');
            const jsonResponse = JSON.parse(filteredText);

            const request = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonResponse),
            });

            if (request.headers.get('Content-Type')?.includes('application/json')) {
                const data = await request.json();
                console.log("Data:", data);
                setShipmentList([...shipmentList, data]);
            } else {
                const text = await request.text();
                console.error("Unexpected response format:", text);
            }
        } catch (error) {
            console.error("Error:", error);
        }

        setInputValue('');
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
            <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'flex-end' }}>
                <FormControl variant="outlined" sx={{ minWidth: 140, marginRight: 1 }}>
                    <InputLabel>Mode</InputLabel>
                    <Select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        label="Mode"
                    >
                        {modes.map((mode) => (
                            <MenuItem key={mode} value={mode}>
                                {mode}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Type your message"
                    variant="outlined"
                    fullWidth
                    multiline
                    maxRows={4}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                            backgroundColor: '#fff',
                        },
                        flexGrow: 1,
                        marginRight: 1,
                    }}
                />
                <IconButton onClick={toggleVoiceInput} color={listening ? "secondary" : "primary"}>
                    <MicIcon />
                </IconButton>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                    startIcon={<SendIcon />}
                    size="medium"
                    sx={{
                        borderRadius: '20px',
                        minWidth: '100px',
                        padding: '8px 16px',
                        boxShadow: 'none',
                        textTransform: 'none',
                    }}
                >
                    Send
                </Button>
            </Paper>
            <Box sx={{ marginTop: 2 }}>
                { shipmentList.length ? <><Typography variant="h6">Shipment List</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tracking Number</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shipmentList.map((shipment, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{shipment.shipment.trackingNumber}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </> : null}
            </Box>
        </Box>
    );
};

export default VoiceInput;
