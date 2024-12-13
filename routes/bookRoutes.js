const express = require('express');
const Book = require('../models/BookModel');

const router = express.Router();

// Add a book
router.post('/', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Borrow a book
router.put('/borrow/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (!book.available) return res.status(400).json({ message: 'Book already borrowed' });

        book.available = false;
        await book.save();
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Return a book
router.put('/return/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        book.available = true;
        await book.save();
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// View all available books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({ available: true });
        res.json(books);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
