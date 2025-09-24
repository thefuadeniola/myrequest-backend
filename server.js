import express from 'express'
import connectToDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import roomRoutes from './routes/roomRoutes.js'

const port = process.env.PORT || 8080

connectToDB();

const app = express();

app.get('/', (req, res) => {
    res.send("Welcome to myrequest server")
})

// body parser middleware for parsing body of json requests
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/room', roomRoutes);


app.listen(port, () => console.log(`Server is runnin on port ${port}`));