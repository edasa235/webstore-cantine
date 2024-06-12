const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to your PostgreSQL database
const pool = new Pool({
    user: 'edasa001',
    host: 'localhost',
    database: 'webstorecantine',
    password: 'hello',
    port: 5432,
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO login (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM login WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (await bcrypt.compare(password, user.password)) {
                res.status(200).json({ user_id: user.user_id });
            } else {
                res.status(401).json({ error: 'Login failed' });
            }
        } else {
            res.status(401).json({ error: 'Login failed' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// New endpoint to handle purchase
app.post('/purchase', async (req, res) => {
    try {
        const { user_id, cart, cardNumber, expiryDate, cvv } = req.body;
        // Ensure you have a table in your database to store these details
        const result = await pool.query(
          'INSERT INTO purchases (user_id, cart, cardNumber, expiryDate, cvv) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [user_id, JSON.stringify(cart), cardNumber, expiryDate, cvv]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Purchase Error:', error);
        res.status(500).json({ error: 'Purchase failed' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

