import "reflect-metadata";
import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookies from 'cookie-parser';

// Routes
import usersRoute from './routes/users.routes';
import authRoute from './routes/auth.routes';
import securityDevicesRoute from './routes/securityDevice.routes';
import blogsRoute from './routes/blogs.routes';
import postsRoute from './routes/posts.routes';
import testRoute from './routes/test.routes';
import {HTTP_STATUSES} from "./config/baseTypes";


const app = express();
app.use(cors());
app.use(cookies());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', true);

app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/security/devices', securityDevicesRoute);
app.use('/api/blogs', blogsRoute);
app.use('/api/posts', postsRoute);
app.use('/api/testing/all-data', testRoute);
app.get('*', (req, res) => res.status(HTTP_STATUSES.NOT_FOUND_404).send('Not found'));

export default app;

