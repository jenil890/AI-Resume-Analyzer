import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { GoogleGenAI } from '@google/genai';
import Analysis from '../models/Analysis.js';

// Parse PDF buffer to text
const parsePDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. Ensure the file is not corrupted or scanned image-only.');
  }
};

// Parse DOCX buffer to text
const parseDOCX = async (buffer) => {
  try {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file.');
  }
};

// Helper to call Google Gemini API
const callGemini = async (prompt, apiKey) => {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          atsScore: { type: 'INTEGER', description: 'Overall ATS compatibility score (0-100)' },
          resumeDetails: {
            type: 'OBJECT',
            description: 'Contact info and summaries extracted from the resume',
            properties: {
              name: { type: 'STRING' },
              email: { type: 'STRING' },
              phone: { type: 'STRING' },
              skills: { type: 'ARRAY', items: { type: 'STRING' } },
              education: { type: 'ARRAY', items: { type: 'STRING' } },
              experience: { type: 'ARRAY', items: { type: 'STRING' } },
            },
            required: ['name', 'email', 'phone', 'skills', 'education', 'experience'],
          },
          atsScoreBreakdown: {
            type: 'OBJECT',
            description: 'Breakdown of score across key metrics (0-100 for each)',
            properties: {
              formatting: { type: 'INTEGER' },
              impact: { type: 'INTEGER' },
              keywords: { type: 'INTEGER' },
              structure: { type: 'INTEGER' },
            },
            required: ['formatting', 'impact', 'keywords', 'structure'],
          },
          strengths: {
            type: 'ARRAY',
            description: 'Core strengths identified in the resume (3-5 items)',
            items: { type: 'STRING' },
          },
          suggestions: {
            type: 'ARRAY',
            description: 'Actionable improvements to optimize the resume',
            items: {
              type: 'OBJECT',
              properties: {
                category: { type: 'STRING', description: 'Category like Keywords, Formatting, Metrics' },
                detail: { type: 'STRING', description: 'Specific and actionable advice' },
                priority: { type: 'STRING', enum: ['high', 'medium', 'low'] },
              },
              required: ['category', 'detail', 'priority'],
            },
          },
          skillsDistribution: {
            type: 'ARRAY',
            description: 'Ratings of primary skills out of 10 (5-8 major skills)',
            items: {
              type: 'OBJECT',
              properties: {
                skill: { type: 'STRING' },
                rating: { type: 'INTEGER', description: 'Skill level (1-10)' },
              },
              required: ['skill', 'rating'],
            },
          },
          recommendations: {
            type: 'STRING',
            description: 'A summary and motivating conclusion recommending next steps',
          },
        },
        required: [
          'atsScore',
          'resumeDetails',
          'atsScoreBreakdown',
          'strengths',
          'suggestions',
          'skillsDistribution',
          'recommendations',
        ],
      },
    },
  });
  return JSON.parse(response.text);
};

export const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { jobDescription } = req.body;
    let resumeText = '';

    const mimeType = req.file.mimetype;
    if (mimeType === 'application/pdf') {
      resumeText = await parsePDF(req.file.buffer);
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      resumeText = await parseDOCX(req.file.buffer);
    } else {
      return res.status(400).json({ message: 'Invalid file type. Only PDF and DOCX files are allowed.' });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from the uploaded file. Please check if the file has selectable text.' });
    }

    // Build the AI prompt
    let prompt = '';
    if (jobDescription && jobDescription.trim().length > 0) {
      prompt = `You are an expert ATS (Applicant Tracking System) reviewer and hiring manager.
Analyze the following resume text against the provided Job Description. Score the resume based on keyword matches, formatting, experience alignment, and action verb impact.

Job Description:
${jobDescription.trim()}

Resume Text:
${resumeText.trim()}

Provide your analysis in the required JSON Schema format. Ensure the ATS score reflects how well the resume matches this specific Job Description.`;
    } else {
      prompt = `You are an expert ATS (Applicant Tracking System) reviewer and hiring manager.
Analyze the following resume text for general industry standards. Infer the targeted role and level, and score the resume based on standard ATS criteria (keyword optimization, impact and metrics, formatting, and layout structure).

Resume Text:
${resumeText.trim()}

Provide your analysis in the required JSON Schema format.`;
    }

    let parsedResult;

    // Check if Groq API Key is configured (Preferred option if available)
    if (process.env.GROQ_API_KEY) {
      console.log('Using Groq API for resume analysis...');
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: `You are an expert ATS (Applicant Tracking System) reviewer and hiring manager.
Analyze the resume and return a structured JSON object.

Format the output strictly as JSON matching this schema:
{
  "atsScore": number (0-100),
  "resumeDetails": {
    "name": string,
    "email": string,
    "phone": string,
    "skills": string[],
    "education": string[],
    "experience": string[]
  },
  "atsScoreBreakdown": {
    "formatting": number (0-100),
    "impact": number (0-100),
    "keywords": number (0-100),
    "structure": number (0-100)
  },
  "strengths": string[],
  "suggestions": [
    {
      "category": string,
      "detail": string,
      "priority": "high" | "medium" | "low"
    }
  ],
  "skillsDistribution": [
    {
      "skill": string,
      "rating": number (1-10)
    }
  ],
  "recommendations": string
}`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1
          })
        });

        if (!groqResponse.ok) {
          const errText = await groqResponse.text();
          throw new Error(`Groq API returned status ${groqResponse.status}: ${errText}`);
        }

        const data = await groqResponse.json();
        parsedResult = JSON.parse(data.choices[0].message.content);
      } catch (groqError) {
        console.error('Groq API call failed:', groqError.message);
        throw groqError;
      }
    } else {
      // Use Gemini API
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: 'Neither Groq nor Gemini API key is configured on the server.' });
      }
      parsedResult = await callGemini(prompt, apiKey);
    }

    // Save analysis to database
    const analysis = new Analysis({
      userId: req.user.id,
      resumeName: req.file.originalname,
      atsScore: parsedResult.atsScore,
      analysisResult: parsedResult,
    });

    await analysis.save();

    res.status(201).json(analysis);
  } catch (error) {
    console.error('Resume upload & analysis error:', error);
    let userMessage = error.message || 'Server error during resume analysis';
    if (typeof userMessage === 'string' && userMessage.trim().startsWith('{')) {
      try {
        const parsedError = JSON.parse(userMessage);
        if (parsedError.error && parsedError.error.message) {
          userMessage = parsedError.error.message;
        }
      } catch (e) {
        // ignore
      }
    }
    res.status(500).json({ message: userMessage });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ userId: req.user.id })
      .select('resumeName atsScore createdAt')
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ message: 'Server error during history retrieval' });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user.id });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis report not found' });
    }
    res.json(analysis);
  } catch (error) {
    console.error('Fetch report details error:', error);
    res.status(500).json({ message: 'Server error during report retrieval' });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const result = await Analysis.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) {
      return res.status(404).json({ message: 'Analysis report not found' });
    }
    res.json({ message: 'Analysis history deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Server error during report deletion' });
  }
};
