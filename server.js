const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Your existing signin route
app.post("/signin", (req, res) => {
    const { email, password } = req.body; // Make sure to use the correct names of the form inputs

    // Read the credentials.json file
    fs.readFile(path.join(__dirname, 'credentials.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading credentials file:", err);
            return res.status(500).send("Internal Server Error");
        }

        const credentials = JSON.parse(data).users;
        console.log(credentials, email, password)
        const user = credentials.find(user => user.email === email && user.password === password);
        console.log(user)

        if (user) {
            // User found
            res.send({ success: true, message: "Credentials match. ✅ " }); // This can be handled by client-side JS
        } else {
            // User not found
            res.send({ success: false, message: "Credentials do not match. ❌" });
        }
    });
});

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    
    // Read the credentials.json file
    fs.readFile(path.join(__dirname, 'credentials.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading credentials file:", err);
            return res.status(500).send("Internal Server Error");
        }
        
        const credentials = JSON.parse(data);
        
        // Check if the user already exists
        const userExists = credentials.users.some(user => user.email === email);
        
        if (userExists) {
            return res.status(400).send({ success: false, message: "User already exists. ❌" });
        }

        // Add new user
        credentials.users.push({ name, email, password });
        
        // Write the updated credentials back to the file
        fs.writeFile(path.join(__dirname, 'credentials.json'), JSON.stringify(credentials, null, 2), (err) => {
            if (err) {
                console.error("Error writing to credentials file:", err);
                return res.status(500).send("Internal Server Error");
            }
            
            res.send({ success: true, message: "User registered successfully. ✅" });
        });
    });
});

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
