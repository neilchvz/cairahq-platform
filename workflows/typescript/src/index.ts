import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { onboardRouter } from './routes/onboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic auth middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers['authorization'];

  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Caira HQ"');
    res.status(401).send('Authentication required');
    return;
  }

  const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  const username = credentials[0];
  const password = credentials[1];

  if (
    username === process.env.BASIC_AUTH_USER &&
    password === process.env.BASIC_AUTH_PASS
  ) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Caira HQ"');
    res.status(401).send('Invalid credentials');
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/onboard', onboardRouter);

app.listen(PORT, () => {
  console.log(`Caira HQ onboarding service running on http://localhost:${PORT}`);
});