const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://challanithin2002:nithin@cluster0.5e0utuo.mongodb.net/userDatabase?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    quizAttempts: [{
        language: String,
        level: String,
        score: Number,
        date: { type: Date, default: Date.now }
    }],
});

// Define the User model
const User = mongoose.model('User', userSchema,'userdata');

app.use(bodyParser.json());
app.post('/signin', async (req, res) => {
    try {
      const { email, password } = req.body;

       
        const user = await User.findOne({ email });

        
        if (user && user.password === password) {
           
            res.json({ message: 'User logged in successfully', email: user.email });
        } else {
           
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/signup', async (req, res) => {
    try {
        // Get user data from the request body
        const { firstName, lastName, email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const newUser = new User({ firstName,lastName, email, password, quizAttempts: [] });

        // Save the user to the database
        await newUser.save();

        // Respond with a success message
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const userSchema1 = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    quizAttempts: [{
        language: String,
        level: String,
        score: Number,
        totalQuestions: Number,
        percentage: Number,
        date: { type: Date, default: Date.now },
    }],
});

// Define the User model
const User1 = mongoose.model('User1', userSchema1, 'userdata');

app.use(bodyParser.json());

// ... Other routes


// Update the server code

// Update the server code

// Update the server code

app.get('/leaderboard', async (req, res) => {
    try {
        // Fetch language and level from the query parameters
        const { language, level } = req.query;

        // Build the match object based on the provided language and level
        const matchObject = {};
        if (language) {
            matchObject['quizAttempts.language'] = language;
        }
        if (level) {
            matchObject['quizAttempts.level'] = level;
        }

        // Fetch relevant data from the database
        const leaderboardData = await User.aggregate([
            // Unwind quizAttempts array to have separate documents for each attempt
            { $unwind: '$quizAttempts' },
            // Match documents based on language and level
            { $match: matchObject },
            // Group by user and calculate total score
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$email' },
                    language: { $first: '$quizAttempts.language' },
                    level: { $first: '$quizAttempts.level' },
                    score: { $max: '$quizAttempts.score' },
                    totalQuestions: { $first: '$quizAttempts.totalQuestions' },
                    percentage: { $max: '$quizAttempts.percentage' },
                },
            },
            // Sort by totalScore in descending order
            { $sort: { percentage: -1 } },
        ]);

        console.log(leaderboardData);

        // Send the modified data to the client
        res.json(leaderboardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/questions', async (req, res) => {
    try {
        // Extract language and user email from the request query parameters
        const language = req.query.language;
        const userEmail = req.query.userEmail;

        // Fetch the user data from the database
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Logic to determine the user's performance and fetch questions accordingly
        // Modify this logic based on your specific criteria
        const difficultyLevel = determineDifficultyLevel(user);
        
        // Fetch questions based on the language and difficulty level
        

        // Send the questions to the client
        res.json(difficultyLevel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to determine the difficulty level based on the user's performance
function determineDifficultyLevel(user) {
    // Get the user's quiz attempts for the specified language
    const englishQuizAttempts = user.quizAttempts.filter(attempt => attempt.language === 'English');

    // Calculate the average score for English quizzes
    const totalScore = englishQuizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const averageScore = totalScore / englishQuizAttempts.length;

    // Determine difficulty level based on the average score
    if (averageScore < 5) {
        return 'Beginner';
    } else if (averageScore >= 5 && averageScore < 8) {
        return 'Intermediate';
    } else {
        return 'Hard';
    }
}

// Function to fetch questions from the database based on language and difficulty level


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
