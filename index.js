require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

// Middleware
app.use(express.json());
app.use('/api/books', bookRoutes);

// Swagger Setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Library Management API',
            version: '1.0.0',
            description: 'API for managing books in a library',
        },
    },
    apis: ['./routes/bookRoutes.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Set the port from environment variables (default to 5000 if not specified)
const PORT = process.env.PORT || 5000;

// MongoDB connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('MongoDB URI is not set in environment variables.');
    process.exit(1); // Stop the app if MONGO_URI is not available
}

// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process if there is an error connecting to MongoDB
    });
