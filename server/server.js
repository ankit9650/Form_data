const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/authMiddleware.js');
const app = express();
const saltRounds = 10;
const formpath = 'Data.json';
const SECRET_KEY = 'Ankit12';

app.use(express.json());
app.use(cors());

const readFile = (callback) => {
    fs.readFile(formpath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return callback(err);
        }
        try {
            const users = JSON.parse(data || '[]');
            callback(null, users);
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            callback(parseError);
        }
    });
};

const writeFile = (users, res) => {
    fs.writeFile(formpath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Error writing file');
        }
        console.log('Data saved!');
        res.status(200).send('Operation successful');
    });
};

// Register 

app.post("/register", async (req, res) => {
    const formData = req.body;
    try {
        const hashedPassword = await bcrypt.hash(formData.password, saltRounds);
        const formid = { ...formData, password: hashedPassword, id: uuidv4() };

        readFile((err, users) => {
            if (err) return res.status(500).send('Error reading users');
            const isExist = users.some(item => item.username === formid.username);

            const adminExists = users.some(item => item.accountType === "Admin");
            if (formid.accountType === "Admin" && adminExists) {
                return res.status(400).send('An admin account already exists');
            }

            if (isExist) {
                return res.status(400).send('User is already registered');
            }

            users.push(formid);
            writeFile(users, res);
        });
    } catch (hashError) {
        console.error('Error hashing password:', hashError);
        return res.status(500).send('Error hashing password');
    }
});

// Update 

app.put('/register/:id', authMiddleware, (req, res) => {
    const userId = req.params.id;

    readFile((err, users) => {
        if (err) return res.status(500).send('Error reading users');

        const index = users.findIndex(user => user.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...req.body };
            writeFile(users, res);
        } else {
            res.status(404).send('User not found');
        }
    });
});

// Delete

app.delete('/register/:id', authMiddleware, (req, res) => {
    const userId = req.params.id;

    readFile((err, users) => {
        if (err) return res.status(500).send('Error reading users');

        const updatedUsers = users.filter(user => user.id !== userId);
        writeFile(updatedUsers, res);
    });
});

// Get 
app.get('/register', authMiddleware, (req, res) => {
    const currentUser = req.user; // Get the current user from the request

    readFile((err, users) => {
        if (err) return res.status(500).send('Error reading users');

        if (currentUser.accountType === 'Admin') {
            // Admins get all users
            return res.status(200).json(users);
        } else {
            // Non-admin users get their own user details
            const userDetail = users.find(user => user.id === currentUser.id);
            if (userDetail) {
                return res.status(200).json([userDetail]); // Return the user's details as an array
            }
        }
        // In case there's no user found, return an empty array
        res.status(200).json([]);
    });
});




// Login
app.post("/login", async (req, res) => {
    const loginData = req.body;

    readFile((err, users) => {
        if (err) return res.status(500).send('Error reading users');

        const user = users.find(item => item.username === loginData.username);
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        const isPasswordValid = bcrypt.compareSync(loginData.password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign(
                { id: user.id, username: user.username, accountType: user.accountType },
                SECRET_KEY,
                { expiresIn: '24h' }
            );
            return res.status(200).send({
                statusCode: 200,
                token: token,
                userType: user.accountType
            });
        } else {
            return res.status(401).send('Invalid password');
        }
    });
});



app.get('/protected', authMiddleware, (req, res) => {
    res.status(200).send('This is a protected route. Welcome, ' + req.user.username + '!');
});


app.listen(5000, () => {
    console.log(`Server is running at http://localhost:5000!`);
});
