const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const app = express();
const saltRounds = 10;


const formpath = 'Data.json';

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

        const isExist = jsonparse.some(item => item.email === newData.email && item.phone === newData.phone);
        if (isExist) {
            return res.status(400).send('User is already registered with this email');
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

app.get('/form',(req,res) => {
    fs.readFile(formpath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }   
        
        res.status(200).json(JSON.parse(data || '[]'));
    });
});

app.post("/login",async (req, res) => {
    const loginData = req.body;

    fs.readFile(formpath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        try {
            const jsonparse = JSON.parse(data || '[]');
            const user = jsonparse.find(item => item.username === loginData.username);           
            if (!user) {
                return res.status(400).send('Invalid username or phone number');
            }
            console.log(user)    
                
          const dcrpyt = bcrypt.compareSync(loginData.password, user.password);    
                  if (dcrpyt) {
                    console.log(loginData.password,user.password,"sssssssssss")  
                    // res.render(Home)
                    return res.status(200).send('Login successful');                 

                  }else{
                        req.send(error) 

                }
                } catch (parseError) {
            console.error('Error parsing data:', parseError);
            return res.status(500).send('Error parsing existing data');
        }
    });
});


app.listen(5000, () => {
    console.log(`Server is running at http://localhost:5000!`);
});
