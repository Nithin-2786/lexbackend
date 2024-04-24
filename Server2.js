const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 10000;
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://challanithin2002:nithin@cluster0.5e0utuo.mongodb.net/userDatabase?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
    email: String,
    quizAttempts: [{
        language: String,
        level: String,
        score: Number,
        totalQuestions: Number,
        percentage: Number,
    }],
    // Add other fields as needed
});

// Define the User model
const User = mongoose.model('User', userSchema, 'userdata');
app.all('/quiz', async (req, res) => {
    try {
        // Get user data from the request body
        const { email, language, level, score, totalQuestions, percentage } = req.body;
        console.log('Received Request:', req.method, req.url);

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user has the quizAttempts property
        if (!user.quizAttempts) {
            user.quizAttempts = [];
        }

        // Add the quiz attempt to the user's quizAttempts array
        user.quizAttempts.push({ language, level, score, totalQuestions, percentage });

        // Save the updated user to the database
        await user.save();

        // Respond with a success message
        res.json({ message: 'Quiz attempt recorded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new route to handle user data request
app.get('/user', async (req, res) => {
    try {
        // Get user email from the request query parameters
        const userEmail = req.query.email;

        // Find the user by email
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with the user data, including quiz attempts
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${port}`);
});
