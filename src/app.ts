import "reflect-metadata";
import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookies from 'cookie-parser';

// Routes
import usersRoute from './routes/users.routes';
import testRoute from './routes/test.routes';


const app = express();
app.use(cors());
app.use(cookies());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', true);

app.use('/api/users', usersRoute);
app.use('/api/testing/all-data', testRoute);
app.get('*', (req, res) => res.send('Not found'));

export default app;

