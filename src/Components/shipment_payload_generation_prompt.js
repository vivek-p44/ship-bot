const getPrompt = (inputValue) => `
Given the input text: "${inputValue}", extract the following details:

1. **Origin**: Extract the origin city name. If common abbreviations are used (e.g., "SF" for San Francisco), convert them to their full names.
2. **Destination**: Extract the destination city name. Apply the same abbreviation expansion rule as the origin.
3. **Identifier**: Identify the shipment identifier type:
   - It can be a **Bill of Lading (BOL)**, **Booking Number (BN)**, or **House Bill of Lading (HBOL)**.
   - Default identifier: **BOL_123** (Bill of Lading).
4. **Carrier SCAC**: Extract the carrier’s **SCAC code** (a 4-letter uppercase code).
   - If a carrier name is provided, use the **first four letters** (e.g., "Maersk Line" → "MAER").
   - If no carrier is provided, use **"CARR"** as the default value.
5. **Address**:
   - If an address is provided in the input, use it.
   - Otherwise, generate a realistic address based on the city name.
   - ***country***: It should contain a 2 digit country code.
6. **Address Lines**: 
   - For **origin** and **destination**, include **actual house number and street name**.
7. **Stops**:
     1. **ORIGIN**
     2. **PORT_OF_LOADING**: Find the nearest port to the origin city.
     3. **PORT_OF_DISCHARGE**: Find the nearest port to the destination city.
     4. **DESTINATION**
     - If the identifier is HBOL, keep all stops in same order.
     - If the identifier is BOL or BN, only include PORT_OF_LOADING and PORT_OF_DISCHARGE stops.
8. **UN/LOCODE Extraction**:
   - Retrieve the **5-letter UN/LOCODE** for both the origin and destination cities.
   
### **Expected JSON Response Format:**
\`\`\`json
{
    "identifiers": [
        {
            "type": "BILL_OF_LADING" | "BOOKING_NUMBER" | "HOUSE_BILL_OF_LADING",
            "value": "<identifier>"
        },
        {
            "type": "<FFW_SCAC if HBOL, else CARRIER_SCAC>",
            "value": "<carrier_scac>"
        }
    ],
    "routeInfo": {
        "stops": [
            {
                "type": "ORIGIN",
                "location": {
                    "name": "<origin>",
                    "address": {
                        "city": "<city>",
                        "state": "<state>",
                        "country": "<country>",
                        "postalCode": "<postal_code>",
                        "addressLines": [
                            "<address_line_1>",
                            "<address_line_2>"
                        ]
                    },
                    "identifiers": [
                        {
                            "type": "PORT_UN_LOCODE",
                            "value": "<origin_locode>"
                        }
                    ]
                }
            },
            {
                "type": "DESTINATION",
                "location": {
                    "name": "<destination>",
                    "address": {
                        "city": "<city>",
                        "state": "<state>",
                        "country": "<country>",
                        "postalCode": "<postal_code>",
                        "addressLines": [
                            "<address_line_1>",
                            "<address_line_2>"
                        ]
                    },
                    "identifiers": [
                        {
                            "type": "PORT_UN_LOCODE",
                            "value": "<destination_locode>"
                        }
                    ]
                }
            }
        ]
    }
}
\`\`\`
`;

export default getPrompt;
