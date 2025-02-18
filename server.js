const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // Allow all origins
app.use(express.json()); // Parse JSON request body

app.post('/proxy/shipment', async (req, res) => {
    try {
        const response = await axios.post(
            'https://na12.api.project44.com/api/v4/shipments/tracking',
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Id': '1728281920130',
                    'X-User-Id': '-1',
                    'Authorization': `Bearer eyJraWQiOiJUb1VCSFZOaXptQjBjWXRMa1haWCIsImFsZyI6IlJTMjU2In0.eyJjdXN0b21lcklkcFJvbGVzIjpbIkxlYWQiLCJCYXNpYyJdLCJnaXZlbk5hbWUiOiJTaHJpbmlsIiwiZmFtaWx5TmFtZSI6IlRoYWtrYXIiLCJ0ZW5hbnRJZCI6IjE2ODczNjA0MjIxNjIiLCJjb21wYW55VWlkIjoiYTljZmE3ZTAtZjEzMy00ODY5LWEzMDItNWU4MDA5M2U3NzhhIiwibGFrZUlkIjoiMTcwMTc2NjczMjUzMyIsImF1dGhJZHBzIjpbIjBvYTFrN3Q2ZXB6MW1IRG5uMGg4Il0sImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE3Mzk4NzI1NTIsImlzcyI6Imh0dHBzOi8vdXNlci1zZXJ2aWNlLWFwaS5hbWVyaWNhcy5wcm9qZWN0NDQuY29tIiwic3ViIjoic2hyaW5pbC50aGFra2FyQHByb2plY3Q0NC5jb20iLCJleHAiOjE3Mzk5MDQxNDIsImp0aSI6IjEwMmMxZDljLTYwMzMtNDNhYS04M2M4LTI5N2EyOTZkZDIwNiJ9.amh-7DfNNqFK1n_ZU2WPCuzkAuAJHDZSCHKQyT3iEZzYIrv5eiVhI1zApZDXWgs3e_Xo01ol5A770kPwateSjjoR1kGwnZEjiItJpbtFMjwihIFFyU4ZZpTsOCX7hsxIo7eP_CQnOOQhMK7C1hRcIcAIXanzQJXupNpMNbwUyj3XA4Jgp0vW7PHPFRqdkpB42jUsuUKdpjhO072jrMo1XC4UA6lMQTjpDKYrfxar_fhyRI9HprwWVGISV2gLz0lFqCL_c1EpysqlRL8_m9E9mDXDbqryxJpnS2Ut_RsaAZuco7FJJxEyENK9ezthyMV4vnFcuAKgnlHGaig0JAxwVg`, // Replace with actual token
                    'X-Tenant-Uuid': '92ca34e7-1d92-4f65-8f02-41619996551d',
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
