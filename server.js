const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors()); // Allow all origins
app.use(express.json()); // Parse JSON request body

app.post('/proxy/shipment', async (req, res) => {
    try {
        const response = await axios.post(
            'https://na12.api.qa-stage.p-44.com/api/v4/shipments/tracking',
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Id': process.env.TENANT_ID,
                    'X-User-Id': '-1',
                    'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
                    'X-Tenant-Uuid': process.env.TENANT_UUID,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || "Server error",
        });
    }
});

app.listen(5050, () => console.log('Proxy server running on port 5050'));
