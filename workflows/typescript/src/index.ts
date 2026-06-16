import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { onboardRouter } from './routes/onboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/onboard', onboardRouter);

app.listen(PORT, () => {
  console.log(`Caira HQ onboarding service running on http://localhost:${PORT}`);
});