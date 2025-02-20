const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors()); // Allow all origins
app.use(express.json()); // Parse JSON request body

app.post('/proxy/unified/shipment', async (req, res) => {
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
        console.error("Error:", error.response ? error.response.data : "No response from server");
        console.error("Error status:", error.response ? error.response.status : "Unknown status");
        res.status(error.response?.status || 500).json({
            error: error.response?.data || "Server error",
        });
    }
});

app.post('/proxy/tl/shipment', async (req, res) => {
    try {
        const response = await axios.post(
            'https://na12.api.qa-stage.p-44.com/api/v4/tl/shipments',
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
        console.error("Error:", error.response ? error.response.data : "No response from server");
        console.error("Error status:", error.response ? error.response.status : "Unknown status");
        res.status(error.response?.status || 500).json({
            error: error.response?.data || "Server error",
        });
    }
});

app.listen(5050, () => console.log('Proxy server running on port 5050'));
