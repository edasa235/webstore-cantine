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

// Define roles
const roles = {
    admin: 'admin',
    user: 'user',
};

// Middleware for role verification
function checkRole(role) {
    return (req, res, next) => {
        // Assuming you have a way to identify the user's role, you can access it from req.user.role
        if (req.user && req.user.role === role) {
            next(); // User has the required role, proceed to the next middleware/route handler
        } else {
            res.status(403).json({ error: 'Forbidden' }); // User does not have the required role
        }
    };
}

app.get('/admin/dashboard', checkRole(roles.admin), async (req, res) => {
    // Only accessible to users with the 'admin' role
    res.status(200).json({ message: 'Admin dashboard' });
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, isAdmin, pinCode } = req.body;
        let role = roles.user;

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO login (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
        res.status(200).json(result.rows[0]);
        if (isAdmin && pinCode === '1234') {
            role = roles.admin;
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/login', async (req, res) => {
    try {
        // After successful authentication, include role information in the response
        // For example, fetch the role from the database based on the user's credentials
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM login WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (await bcrypt.compare(password, user.password)) {
                // Return the user ID and role upon successful login
                res.status(200).json({ user_id: user.user_id, role: user.role });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

