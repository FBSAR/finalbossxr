import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads (store in memory for now)
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

// Jobs application endpoint
app.post('/jobs', upload.single('resume'), (req: Request, res: Response) => {
  const { jobId, jobTitle, name, email, phone, linkedin, portfolio, experience, whyJoin } = req.body;
  const resume = req.file;

  // Log the received data
  console.log('=== Job Application Received ===');
  console.log('Job ID:', jobId);
  console.log('Job Title:', jobTitle);
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Phone:', phone);
  console.log('LinkedIn:', linkedin);
  console.log('Portfolio:', portfolio);
  console.log('Experience:', experience);
  console.log('Why Join:', whyJoin);
  console.log('Resume:', resume ? { filename: resume.originalname, size: resume.size, mimetype: resume.mimetype } : 'No file uploaded');
  console.log('================================');

  res.json({
    success: true,
    message: 'Application received successfully',
    data: {
      jobId,
      jobTitle,
      name,
      email,
      phone,
      linkedin,
      portfolio,
      experience,
      whyJoin,
      resume: resume ? { filename: resume.originalname, size: resume.size, mimetype: resume.mimetype } : null
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
