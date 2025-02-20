const getTlPrompt = (inputValue, currentDate) => `
Given the input: "${inputValue}", extract the following details in JSON format:

1. **Origin & Destination**: Identify city names and expand common abbreviations (e.g., "SF" → "San Francisco").
2. **Shipment Identifiers**:
   - Type: "BILL_OF_LADING"
   - Value: Extracted from input or default to "BOL_2345" (no spaces).
3. **Carrier Identifier**:
   - Type: "SCAC"
   - Value: First four letters of carrier name (default: "EXPD").
4. **Shipment Stops**:
   - Generate two stops using the origin and destination cities.
   - Include addresses (realistic if not provided).
   - Use 2-digit country codes.
5. **Appointment Window**:
   - **now-1d**: One day before ${currentDate}
   - **now-2d**: Two day before ${currentDate}
   - **now+1d**: One day after ${currentDate}
   - **now+2d**: Two day after ${currentDate}
   - Format: YYYY-MM-DDTHH:mm:ss.
   - Use the correct local timezone for each city.
   
### **Expected JSON Response Format:**
\`\`\`json
{
    "carrierIdentifier": {
        "type": "SCAC",
        "value": "EXPD"
    },
    "shipmentIdentifiers": [
        {
            "type": "BILL_OF_LADING",
            "value": "<Shipment Identifiers.Value>"
        }
    ],
    "shipmentStops": [
        {
            "stopNumber": 1,
            "appointmentWindow": {
                "startDateTime": "<now-2d>",
                "endDateTime": "<now-1d>",
                "localTimeZoneIdentifier": "<timezone of the city, format: America/Los_Angeles>"
            },
            "location": {
                "address": {
                    "postalCode": "60654",
                    "addressLines": [
                        "222 Merchandise Mart Plz Ste 1744, Chicago, IL 60654"
                    ],
                    "city": "Chicago",
                    "state": "IL",
                    "country": "US"
                },
                "contact": {
                    "companyName": "Project44",
                    "contactName": " "
                }
            },
            "stopName": "Project44"
        },
        {
            "stopNumber": 2,
            "appointmentWindow": {
                "startDateTime": "<now+1d>",
                "endDateTime": "<now+2d>",
                "localTimeZoneIdentifier": "<timezone of the city, format: America/Los_Angeles>"
            },
            "location": {
                "address": {
                    "postalCode": "94104",
                    "addressLines": [
                        "400 Montgomery St Ste 2. San Francisco, CA 94104"
                    ],
                    "city": "San Francisco",
                    "state": "CA",
                    "country": "US"
                },
                "contact": {
                    "companyName": "Project44",
                    "contactName": " "
                }
            },
            "stopName": "Project44"
        }
    ],
    "equipmentIdentifiers": [],
    "apiConfiguration": {
        "fallBackToDefaultAccountGroup": false
    },
    "equipmentIdentifierChanges": []
}
\`\`\`
`;

export default getTlPrompt;
