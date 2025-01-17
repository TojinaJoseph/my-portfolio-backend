// server.js

const express = require('express');
const cors = require('cors');
const nodemailer=require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose=require("mongoose");
const app = express();

app.use(bodyParser.json());

const allowedOrigins = [
  "https://tojinajoseph.github.io",
  "http://localhost:5173",
];

// Middleware to allow cross-origin requests (important for React and Node to talk)
app.use(cors(
  {
    origin: (origin, callback) => {
      // Allow all origins in the allowedOrigins list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the request
      }
    }, // Replace with your frontend domain
  }
));

// Middleware to parse JSON requests
app.use(express.json());

// Create a transporter using your email provider's SMTP server
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // You can use another email service like Outlook, Yahoo, etc.
//     auth: {
//         user: "tojinajoseph123@gmail.com",
//         pass: "mqoy sgyk inlf znuo" // Replace with your email password (or an app password for Gmail)
//     },
  
//   });


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


  // Define a schema for User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subject: { type: String },
  message: {type: String}
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);


app.get('/api/getmail', async (req ,res) => {
  console.log("hjhjhjh")
  try {
    console.log("in server get")
    const users = await User.find(); // Retrieve all users from the database
    console.log(users)
    return res.status(200).json(users); // Send data back as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from MongoDB', error });
  }
});
// Simple API route to test
app.post('/api/sendmail', (req, res) => {
  const {name,subject,email,message} =req.body.formData;
  console.log("in server post")
  const newUser = new User({
    name: name,
    email: email,
    subject: subject,
    message: message
  });
  console.log("in server post")
  newUser.save()
    .then((savedUser) => {
      return res.send({message:'Message sent successfully with data'});
    })
    .catch((err) => {
      console.error('Error saving user:', err);
    });
  
 
//  const mailOptions = {
//     from: email, // The sender's email address
//     to: 'tojinajoseph123@gmail.com', // Replace with the email you want to send to
//     subject: `Message from ${name}`,
//     text: `You have a new message from ${name} (${email}):\n\n${message}`,
//   };

//   // Send the email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send('Error sending email');
//     }
//     else{
//         return res.status(200).send('Message sent successfully');
//     }
    
//   });

  
});

// Update an item
app.put('/api/items/:id', async (req, res) => {
  const { name, email,subject,message} = req.body;
  const updatedItem = await User.findByIdAndUpdate(
      req.params.id,
      { name, email,subject,message },
      { new: true }
  );
  res.json(updatedItem);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});