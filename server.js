const express = require('express');
//const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
//app.use(cors());
app.use(express.static(path.join(__dirname)));

// Root route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Check if the URI is defined
if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
  console.error('Invalid MongoDB URI');
  process.exit(1);
}

// Create a MongoDB client
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

// Call the function to connect
connectToDatabase();

// Route to get and reverse the client's IP
app.get('/get-reverse-ip', async (req, res) => {
 try {
    // retrieve ip address
const response = await fetch('https://api.ipify.org?format=json') 
const data = await response.json()

if(!data.ip)return


//perform reversal
const reversedIp = data.ip.split('.').reverse().join('.');

//update database
const db = client.db('ipDatabase');
const collection = db.collection('ipAddresses');
await collection.insertOne({ ip: reversedIp });
res.status(200).json({data:{reversedIp}})
// Check if the IP exists in the database
//let ipData = await collection.findOne({ ip: clientIp });

// If IP doesn't exist, insert it into the database
//if (!ipData) {
  //await collection.insertOne({ ip: clientIp });
 // ipData = { ip: clientIp };
//}

//respond with reversed ip


 } catch (error) {
    res.status(500).json({message:error})
 }


  

//   // Construct the public URL
//   const publicUrl = `${req.protocol}://${clientIp}:${port}/get-reverse-ip`;
//   console.log(`Public URL of the client: ${publicUrl}`);

//   try {
   

//     // Reverse the IP address
    
//     res.json({ reversedIp });

//   } catch (error) {
//     console.error('Error processing IP:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


