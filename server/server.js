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

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

// Read data from file
const readFile = (callback) => {
    fs.readFile(formPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return callback(err);
        }
        try {
            const jsonData = JSON.parse(data || '{"users": [], "products": []}');
            callback(null, jsonData);
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            callback(parseError);
        }
    });
};

// Write data to file
const writeFile = (data, res) => {
    fs.writeFile(formPath, JSON.stringify(data, null, 2), (err) => {
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

        readFile((err, data) => {
            if (err) return res.status(500).send('Error reading users');
            
            const users = data.users;
            const userExists = users.some(item => item.username === newUser.username);
            const adminExists = users.some(item => item.accountType === "Admin");

            if (newUser.accountType === "Admin" && adminExists) {
                return res.status(400).send('An admin account already exists');
            }

            if (userExists) {
                return res.status(400).send('User is already registered');
            }

            users.push(newUser);
            writeFile(data, res);
        });
    } catch (hashError) {
        console.error('Error hashing password:', hashError);
        return res.status(500).send('Error hashing password');
    }
});

// Get users endpoint
app.get('/register', authMiddleware, (req, res) => {
    const currentUser = req.user; 

    readFile((err, data) => {
        if (err) return res.status(500).send('Error reading users');

        const users = data.users;
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
app.put("/register/:id", authMiddleware, upload.single('avatar'), (req, res) => {
    const userId = req.params.id;
    const { username, email, phone, hobbies } = req.body;

    readFile((err, data) => {
        if (err) return res.status(500).send('Error reading users');

        const users = data.users;
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = {
            ...users[userIndex], 
            ...(username && { username }), 
            ...(email && { email }), 
            ...(phone && { phone }), 
            ...(hobbies && { hobbies: JSON.parse(hobbies) }),
            ...(req.file && { Avatar: `/uploads/${req.file.filename}` }) 
        };

        users[userIndex] = updatedUser;

        writeFile(data, res);
    });
});

// Delete user endpoint
app.delete('/register/:id', authMiddleware, (req, res) => {
    const userId = req.params.id;
    const currentUser = req.user;     
    if (currentUser.accountType !== 'Admin') {
        return res.status(403).send('Only admins can delete users.');
    }
    readFile((err, data) => {
        if (err) return res.status(500).send('Error reading users');

        const users = data.users;
        const updatedUsers = users.filter(user => user.id !== userId);
        data.users = updatedUsers;

        writeFile(data, res);
    });
});

// Login endpoint
app.post("/login", async (req, res) => {
    const loginData = req.body;

    readFile((err, data) => {
        if (err) return res.status(500).send('Error reading users');

        const users = data.users;
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

// Add product endpoint
app.post("/product", authMiddleware, upload.single('prodimg'), async (req, res) => {
    const formData = req.body;

    const newProduct = {
        productid: uuidv4(),
        title: formData.title,
        unit: formData.unit,
        color: formData.color,
        price: formData.price,
        prodimg: req.file ? `/uploads/${req.file.filename}` : null,
        userId: req.user.id,
        userName: req.user.username
    };

    readFile((err, data) => {
        if (err) return res.status(500).send('Error reading products');
        data.products.push(newProduct);
        writeFile(data, res);
    });
});

// Get products endpoint
app.get('/product', authMiddleware, (req, res) => {
    const currentUser = req.user;

    readFile((err, data) => {
        if (err) return res.status(500).send('Error reading products');

        const products = data.products || [];
        
        if (currentUser.accountType === 'Admin') {
            return res.status(200).json(products);
        } else {
            const userProducts = products.filter(product => product.userId === currentUser.id);
            return res.status(200).json(userProducts);
        }
    });
});

// Delete Product endpoint
// Delete Product endpoint
app.delete('/product/:id', authMiddleware, (req, res) => {
    const productId = req.params.id;
    const currentUser = req.user;

    readFile((err, data) => {
        if (err) return res.status(500).send('Error reading products');

        const products = data.products;
        const productIndex = products.findIndex(product => product.productid === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

       
        if (currentUser.accountType !== 'Admin' && products[productIndex].userId !== currentUser.id) {
            return res.status(403).send('You can only delete your own products.');
        }

        products.splice(productIndex, 1);
        writeFile(data, res);
    });
});


// Update Product endpoint
app.put("/product/:id", authMiddleware, upload.single('prodimg'), (req, res) => {
    const productId = req.params.id;
    const { title, color, unit } = req.body;

    readFile((err, data) => {
        if (err) {
            console.error('Error reading products:', err);
            return res.status(500).send('Error reading products');
        }

        const products = data.products;
        const productIndex = products.findIndex(product => product.productid === productId);

        if (productIndex === -1) {
            console.error('Product not found:', productId);
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = {
            ...products[productIndex],
            ...(title && { title }),
            ...(color && { color }),
            ...(unit && { unit }),
            ...(req.file && { prodimg: `/uploads/${req.file.filename}` })
        };

        products[productIndex] = updatedProduct;

        writeFile(data, res);
    });
});

// Protected route example
app.get('/protected', authMiddleware, (req, res) => {
    res.status(200).send('This is a protected route. Welcome, ' + req.user.username + '!');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}!`);
});


