import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from 'router';

const app = express();
dotenv.config();

const PORT = process.env.PORT!;
const MONGO_URL = process.env.MONGO_URL!;
app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo connection error:", err));
app.get('/ping', (req, res) => res.send('pong'));
app.use('/', router());

const server = http.createServer(app);

server.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});





