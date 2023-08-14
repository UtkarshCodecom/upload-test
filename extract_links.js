const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package

const app = express();
app.use(express.json()); // Add middleware to parse JSON body

// Use cors middleware to enable CORS support
app.use(cors());


app.post('/get-website-details', async (req, res) => {
  res.json("working");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
