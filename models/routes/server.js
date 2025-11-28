// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. ज़रूरी Dependencies और Routes को इम्पोर्ट करें
const authRoutes = require('./routes/auth'); // **मॉड्यूलर रूट यहाँ जोड़ा गया**

// 2. Connection और Ports
// ***यहाँ अपनी URI में <db_password> की जगह अपना असली पासवर्ड डालें***
const CONNECTION_URI = 'mongodb+srv://Drishti_New:<db_password>@cluster0.kwgbbnj.mongodb.net/?appName=Cluster0'; 

const PORT = process.env.PORT || 5000;
const app = express();

// 3. Middlewares
app.use(express.json()); 
app.use(cors());

// 4. API Routes को जोड़ें
app.use('/api/auth', authRoutes); 

// 5. MongoDB Connection
mongoose.connect(CONNECTION_URI)
.then(() => {
    console.log('✅ MongoDB से सफलतापूर्वक जुड़ गए! (कोडिंग शुरू)');
    
    // ----------------------------------------------------
    // 💡 FUTURE HOOK: Real-time/Socket.io के लिए जगह
    // यह Real-time चैट/नोटिफिकेशन के लिए इस्तेमाल होगा। 

[Image of WebSocket technology flow]

    // ----------------------------------------------------
    const server = app.listen(PORT, () => {
        console.log(`🚀 सर्वर पोर्ट ${PORT} पर चल रहा है।`);
    });

    // भविष्य में: const io = require('socket.io')(server); 
    // ----------------------------------------------------

})
.catch((error) => {
    console.error('❌ MongoDB Connection Failed: ', error.message);
    console.error('कृपया server.js में CONNECTION_URI को चेक करें।');
    process.exit(1); 
});

// 6. Test Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Drishti Backend Chal Raha Hai Aur MongoDB Se Connected Hai!' });
});
