// server.js

const express = require('express');
const cors = require('cors');
const nodemailer=require('nodemailer');
const bodyParser = require('body-parser');
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


// Set up MongoDB URI
const mongoURI = 'mongodb+srv://tojinajoseph123:GlXOGKLmerRQTCYt@cluster0.qokad.mongodb.net/myPortfolio?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, {
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

// Simple API route to test
app.post('/api/sendmail', (req, res) => {
  const {name,subject,email,message} =req.body.formData;

  const newUser = new User({
    name: name,
    email: email,
    subject: subject,
    message: message
  });
  
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

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});