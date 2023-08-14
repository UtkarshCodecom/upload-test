const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cors = require('cors'); // Import the cors package

const app = express();
app.use(express.json()); // Add middleware to parse JSON body

// Use cors middleware to enable CORS support
app.use(cors());

// Function to fetch the size of a URL's response data
async function fetchSize(url) {
  try {
    const response = await axios.head(url);
    return Number(response.headers['content-length']);
  } catch (error) {
    return null; // Return null in case of error or NaN size
  }
}

app.post('/get-website-details', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required in the request body.' });
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Enable request interception
  await page.setRequestInterception(true);

  // Intercept requests and store URLs
  const urls = [];
  page.on('request', (interceptedRequest) => {
    const interceptedUrl = interceptedRequest.url();
    urls.push(interceptedUrl);
    interceptedRequest.continue();
  });

  // Navigate to the desired website
  await page.goto(url);

  // Wait for the page to load (you can adjust the waiting time based on your requirements)
  await page.waitForTimeout(5000);

  // Fetch the size of each URL's response data
  const urlsWithSizes = await Promise.all(
    urls.map(async (url) => {
      const sizeInBytes = await fetchSize(url);
      return { url, sizeInBytes };
    })
  );

  // Filter out URLs with NaN size  // Sort the URLs in descending order based on their sizes
  urlsWithSizes.sort((url1, url2) => url2.sizeInBytes - url1.sizeInBytes);


  await browser.close();

  // Output the second largest URL with its size
  res.json(urlsWithSizes[1]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
