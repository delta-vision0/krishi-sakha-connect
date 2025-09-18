import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// ES module path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Using port 3000 as it's less likely to be in use

// Error handling for port already in use
const startServer = () => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy. Trying port ${port + 1}...`);
      setTimeout(() => {
        app.listen(port + 1);
      }, 1000);
    } else {
      console.error('Server error:', err);
    }
  });
};

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite's default dev server port
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Initialize Gemini AI using env var
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!req.body.plantName) {
      return res.status(400).json({ error: 'Plant name is required' });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro",
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.2,
        topP: 0.95,
        topK: 40
      }
    });

    // Convert the buffer to base64
    const base64Image = req.file.buffer.toString('base64');

    // Create the prompt
    const prompt = `You are an expert plant pathologist. Analyze the attached image and return a JSON object with the structure: 
    {
      "identification": {
        "isHealthy": boolean,
        "diseaseName": string,
        "scientificName": string,
        "confidenceScore": number,
        "shortDescription": string
      },
      "solutionTabs": {
        "aboutDisease": {
          "title": string,
          "content": [{"heading": string, "text": string}]
        },
        "organicSolutions": {
          "title": string,
          "content": [{"heading": string, "text": string}]
        },
        "chemicalSolutions": {
          "title": string,
          "content": [{"heading": string, "text": string}]
        },
        "preventiveMeasures": {
          "title": string,
          "content": [{"heading": string, "text": string}]
        }
      }
    }
    Respond ONLY with JSON (no markdown/code blocks). 
    Plant name: ${req.body.plantName}
    Location: ${req.body.location || 'Ichalkaranji, Maharashtra, India'}`;

    // Generate content
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    let analysis = null;
    try {
      analysis = JSON.parse(text);
    } catch (e) {
      // Try to extract JSON from the text if Gemini returns extra text
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          analysis = JSON.parse(match[0]);
        } catch (e2) {
          analysis = null;
        }
      }
    }

    if (!analysis) {
      return res.status(500).json({ error: 'Failed to parse Gemini response', rawResponse: text });
    }

    res.json({ 
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      details: error.message 
    });
  }
});

// Text generation endpoint (no image) - builds responses using server-held key
app.post('/api/gemini/text', async (req, res) => {
  try {
    const { prompt, context } = req.body || {};
    if (!prompt && !context) {
      return res.status(400).json({ error: 'Missing prompt/context' });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.3,
        topP: 0.95,
        topK: 40
      }
    });

    const parts = [];
    if (context) parts.push(String(context));
    if (prompt) parts.push(String(prompt));

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text() || '';
    res.json({ text });
  } catch (error) {
    console.error('Error in /api/gemini/text:', error);
    res.status(500).json({ error: 'Generation failed', details: error.message });
  }
});

// Start the server
startServer();