const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware.js');

const app = express();
const saltRounds = 10;
const formPath = 'Data.json'; 
const SECRET_KEY = 'Ankit12';  

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uploadDir = path.join(__dirname, 'server/Form/public');
app.use('/uploads', express.static(uploadDir));


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//  Multer 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

// read data from the JSON file
const readFile = (callback) => {
    fs.readFile(formPath, 'utf8', (err, data) => {
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
    fs.writeFile(formPath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Error writing file');
        }
        console.log('Data saved!');
        res.status(200).send('Operation successful');
    });
};

// Register endpoint
app.post("/register", upload.single('Avatar'), async (req, res) => {
    const formData = req.body;

    console.log("Form Data:", formData); 

    if (!formData.password) {
        return res.status(400).send('Password is required');
    }

    try {
        const hashedPassword = await bcrypt.hash(formData.password, saltRounds);
        const newUser = { 
            ...formData, 
            password: hashedPassword,
            id: uuidv4(),
            Avatar: req.file ? `/uploads/${req.file.filename}` : null 
        };

        readFile((err, users) => {
            if (err) return res.status(500).send('Error reading users');
            
            const userExists = users.some(item => item.username === newUser.username);
            const adminExists = users.some(item => item.accountType === "Admin");

            if (newUser.accountType === "Admin" && adminExists) {
                return res.status(400).send('An admin account already exists');
            }

            if (userExists) {
                return res.status(400).send('User is already registered');
            }

            users.push(newUser);
            writeFile(users, res);
        });
    } catch (hashError) {
        console.error('Error hashing password:', hashError);
        return res.status(500).send('Error hashing password');
    }
});

// Get users endpoint
app.get('/register', authMiddleware, (req, res) => {
    const currentUser = req.user; 

    readFile((err, users) => {
        if (err) return res.status(500).send('Error reading users');

        if (currentUser.accountType === 'Admin') {
            return res.status(200).json(users);
        } else {
            const userDetail = users.find(user => user.id === currentUser.id);
            if (userDetail) {
                return res.status(200).json([userDetail]); 
            }
        }
        
        res.status(200).json([]); 
    });
});

// Update user endpoint
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

// Delete user endpoint
app.delete('/register/:id', authMiddleware, (req, res) => {
    const userId = req.params.id;

    readFile((err, users) => {
        if (err) return res.status(500).send('Error reading users');

        const updatedUsers = users.filter(user => user.id !== userId);
        writeFile(updatedUsers, res);
    });
});

// Login endpoint
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
                { expiresIn: '1h' }
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

// list product










// Protected route example
app.get('/protected', authMiddleware, (req, res) => {
    res.status(200).send('This is a protected route. Welcome, ' + req.user.username + '!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}!`);
});
