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
const SECRET_KEY = 'ankit123'; 

app.use(express.json());
app.use(cors());
 

const main = (filePath, newData, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        let jsonparse = [];

        if (!err && data) {
            try {
                jsonparse = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing data:', parseError);
                return res.status(500).send('Error parsing existing data');
            }
        }

        const isExist = jsonparse.some(item => item.username === newData.username);
        if (isExist) {
            return res.status(400).send('User is already registered with this username');
        }

        jsonparse.push(newData);

        fs.writeFile(filePath, JSON.stringify(jsonparse, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing file:', writeError);
                return res.status(500).send('Error writing file');
            }
            console.log('Data saved!');
            res.status(200).send('Registration successful!');
        });
    });
};

app.post("/form", async (req, res) => {
    const formData = req.body;
    try {
        const hashedPassword = await bcrypt.hash(formData.password, saltRounds);
        const formid = { ...formData, password: hashedPassword, id: uuidv4() };

        main(formpath, formid, res);
    } catch (hashError) {
        console.error('Error hashing password:', hashError);
        return res.status(500).send('Error hashing password');
    }
});
app.put('/form/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    const index = users.findIndex(user => user.id === userId);
  
    if (index !== -1) {
      users[index] = { id: userId, ...req.body };
      res.json(users[index]);
    } else {
      res.status(404).send('User not found');
    }
  });

  app.delete('/form/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    users = users.filter(user => user.id !== userId);
    res.status(204).send();
  });

app.get('/form', (req, res) => {              
    fs.readFile(formpath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }   
        
        res.status(200).json(JSON.parse(data || '[]'));
    });
});

app.post("/login", async (req, res) => {
    const loginData = req.body;

    fs.readFile(formpath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        try {
            const jsonparse = JSON.parse(data || '[]');
            const user = jsonparse.find(item => item.username === loginData.username);

            if (!user) {
                return res.status(400).send('Invalid username or password');
            }

            const isPasswordValid = bcrypt.compareSync(loginData.password, user.password);
            if (isPasswordValid) {        
                const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
                    expiresIn: '1h'
                   
                });
                console.log('Generated JWT Token:', token);
                console.log('Login successful for:', loginData.username);
                return res.status(200).json({ token }); 
            } else {
                return res.status(401).send('Invalid password');
            }
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            return res.status(500).send('Error parsing existing data');
        }
    });
});


app.get('/protected', authMiddleware, (req, res) => {
    res.status(200).send('This is a protected route. Welcome, ' + req.user.username + '!');
});

app.listen(5000, () => {
    console.log(`Server is running at http://localhost:5000!`);
});
