import React, { useState } from 'react';
import { TextField, Box, Paper, Button } from '@mui/material';
// import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyAqPFUB4MdQILFmdMCOdeDD-g08GFY8sw4");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

        const prompt = `Give me name of place from this text "${inputValue}", Find origin or start point and end point and identifier which can be either BOL,Bill of load, Booking number, Housebill or lading from this text and return me response in json format { origin, destionation, identifier }`;
        const result = await model.generateContent(prompt, {
            responseMimeType: 'application/json',
        });
        const response = await result.response;
        const text = response.text();
        const filteredText = text.replace(/```json\n|```/g, '');
        const token = ``

        try {
            const jsonResponse = JSON.parse(filteredText); // Ensure valid JSON
            const request = await fetch('https://na12.api.project44.com/api/v4/shipments/tracking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Id': '1728281920130',
                    'X-User-Id': '-1',
                    'Authorization': `Bearer ${token}`,
                    'X-Tenant-Uuid': '92ca34e7-1d92-4f65-8f02-41619996551d',
                    // "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(jsonResponse),
            });
            const data = await request.json();
            console.log(data);
          } catch (error) {
            console.error("Invalid JSON format:", text);
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