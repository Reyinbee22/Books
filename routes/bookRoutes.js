const express = require('express');
const Book = require('../models/BookModel');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         available:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /books/borrow/{id}:
 *   put:
 *     summary: Borrow a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       404:
 *         description: Book not found
 *       400:
 *         description: Book already borrowed or bad request
 */
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

/**
 * @swagger
 * /books/return/{id}:
 *   put:
 *     summary: Return a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       404:
 *         description: Book not found
 *       400:
 *         description: Bad request
 */
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

/**
 * @swagger
 * /books:
 *   get:
 *     summary: View all available books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of available books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({ available: true });
        res.json(books);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
