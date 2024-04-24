const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://challanithin2002:nithin@cluster0.5e0utuo.mongodb.net/QuizeQuestion?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Define the question schema
const questionSchema = new mongoose.Schema({
    language: String,
    level: String,
    question: String,
    options: [String],
    answer: String,
    // Add other fields as needed
});

// Define the Question model
const Question = mongoose.model('Question', questionSchema, 'Questions');



// Define the getQuestions function
async function getQuestions(language, level) {
    try {
        // Fetch 5 questions based on language and level
        const questions = await Question.find({ language, level }).limit(10);
        return questions;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Define a route to handle fetching questions
app.all('/startQuiz', async (req, res) => {
    try {
        const { language, level } = req.query;
        console.log('Received Query:', { language, level });

        // Fetch questions from the database and send them as JSON
        const questions = await getQuestions(language, level);
        console.log('Fetched questions:', questions);

        res.json(questions);
    } catch (error) {
        // Handle errors and send an appropriate response
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/questions', async (req, res) => {
    try {
        // Extract language and user email from the request query parameters
        
        const language = req.query.language;
        const level = req.query.level;
        
        // Fetch the user data from the database
      

        // Logic to determine the user's performance and fetch questions accordingly
        // Modify this logic based on your specific criteria
       
        const questions = await fetchQuestions(language,level);
        // Fetch questions based on the language and difficulty level
        

        // Send the questions to the client
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
async function fetchQuestions(language, difficultyLevel) {
    // Implement your logic to fetch questions from the database based on language and difficulty level

    // Example: Fetching questions from a hypothetical database
    if(difficultyLevel==='Beginner'){
    const questions = await Question.find({
        language: language,
        level:'Beginner' ,
    }).limit(7); 
    const questions1 = await Question.find({
        language: language,
        level:"Intermediate",
    }).limit(3);
    return [...questions, ...questions1];  

}
else{
    const questions = await Question.find({
        language: language,
        level:'Beginner' ,
    }).limit(5); 
    const questions1 = await Question.find({
        language: language,
        level:"Intermediate",
    }).limit(5);
    return [...questions, ...questions1];  

}

}


// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${port}`);
});
