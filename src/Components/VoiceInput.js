import React, { useState } from 'react';
import getPrompt from './shipment_payload_generation_prompt';
import { TextField, Box, Paper, Button } from '@mui/material';
// import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyAqPFUB4MdQILFmdMCOdeDD-g08GFY8sw4");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

const VoiceInput = () => {
    const [inputValue, setInputValue] = useState('');

    const toggleVoiceInput = () => {
        // if (listening) {
        //     SpeechRecognition.stopListening();
        // } else {
        //     SpeechRecognition.startListening({ continuous: true });
        // }
    };

    const handleSend = async () => {
        console.log('Message sent:', inputValue);
        // resetTranscript(); // Clear the transcript

        const prompt = getPrompt(inputValue);

        try {
            const result = await model.generateContent(prompt, {
                responseMimeType: 'application/json',
            });
            const response = await result.response;
            const text = await response.text();
            console.log('Json:', text);
            const filteredText = text.replace(/```json\n|```/g, '');
            const jsonResponse = JSON.parse(filteredText); // Ensure valid JSON


            const request = await fetch('http://localhost:5050/proxy/shipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonResponse),
            });

            if (request.headers.get('Content-Type')?.includes('application/json')) {
                const data = await request.json();
                console.log("Data:", data);
            } else {
                const text = await request.text();
                console.error("Unexpected response format:", text);
            }
        } catch (error) {
            console.error("Error:", error);
        }

        setInputValue(''); // Clear the input value
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'flex-end' }}>
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                    startIcon={<SendIcon />}
                    size="medium"
                    sx={{
                        borderRadius: '20px',
                        minWidth: '40px',
                        padding: '8px 16px',
                        boxShadow: 'none',
                        textTransform: 'none',
                    }}
                >
                    Send
                </Button>
            </Paper>
        </Box>
    );
};

export default VoiceInput; 