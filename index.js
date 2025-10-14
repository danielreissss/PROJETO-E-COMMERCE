    require('dotenv').config();
    const express = require('express');
    require('./backend/database.js');
    const app = express();
    app.use(express.json()); // Enable parsing of JSON request bodies

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });