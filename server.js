const Redis = require("ioredis"); // Import Redis
const axios = require("axios"); // Import Axios
const express = require("express"); // Import Express

const client = new Redis(); // Create a new Redis client
const app = express(); // Create an Express app

app.get('/', async (req, res) => {
    try {
        // Use await to get the cache value
        const cacheValue = await client.get('users');
        
        if (cacheValue) {
            // If cached value exists, return it
            return res.json(JSON.parse(cacheValue));
        }

        // Fetch data from the external API
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        // const response = users.JSON
        const data = response.data;

        // Set the fetched data in Redis cache
        await client.set('users', JSON.stringify(data));
        await client.expire('users', 30); // Set expiration for 30 seconds

        // Return the fetched data
        return res.json(data);
    } catch (error) {
        // Handle errors (e.g., log them and send a 500 status code)
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server on port 9000
app.listen(9000, () => {
    console.log('Server running on http://localhost:9000');
});
