// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Car = require('./models/car'); // Import the Car model

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/carDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Routes
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + '/home.html');
    } else {
        res.redirect('/login');
    }
});
app.post('/selectUser', (req, res) => {
    const userType = req.body.userType;
    if (userType === 'existing') {
        res.redirect('/login');
    } else if (userType === 'new') {
        res.redirect('/register');
    } else {
        res.status(400).send('Invalid user type');
    }
});

app.get('/carForm', (req, res) => {
    if (req.session.userId) {
        res.sendFile(__dirname + '/index.html');
    } else {
        res.redirect('/login');
    }
});

app.post('/submit', (req, res) => {
    const { name, currentPetrol, mileage } = req.body;
    const newCar = new Car({
        name,
        currentPetrol,
        mileage
    });
    newCar.save()
        .then(() => {
            setTimeout(function() {
                res.redirect('/');
            }, 3000);
        })
        .catch(err => {
            console.error('Error saving car details:', err);
            res.status(500).send('Error saving car details');
        });
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result) {
                            req.session.userId = user._id;
                            res.redirect('/');
                        } else {
                            res.status(400).send('Invalid username or password');
                        }
                    })
                    .catch(err => {
                        console.error('Error comparing passwords:', err);
                        res.status(500).send('Internal server error');
                    });
            } else {
                res.status(400).send('User not found');
            }
        })
        .catch(err => {
            console.error('Error finding user:', err);
            res.status(500).send('Internal server error');
        });
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});


app.post('/register', (req, res) => {
    const { username, password, email } = req.body; // Extract email from request body
    bcrypt.hash(password, 10)
      .then(hashedPassword => {
        const newUser = new User({ username, password: hashedPassword, email }); // Include email when creating new user
        newUser.save()
          .then(() => {
            res.redirect('/login');
          })
          .catch(err => {
            console.error('Error saving user:', err);
            res.status(500).send('Error registering user');
          });
      })
      .catch(err => {
        console.error('Error hashing password:', err);
        res.status(500).send('Internal server error');
      });
});



// Define a route to handle requests to '/cars'
app.get('/cars', async (req, res) => {
    try {
        // Fetch car information from the database
        const cars = await Car.find(); // Assuming Car is your Mongoose model for cars
        // Send JSON data containing the car information to the client
        res.json(cars);
    } catch (error) {
        console.error('Error fetching car information:', error);
        // Send an error response to the client
        res.status(500).send('Error fetching car information');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
