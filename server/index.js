require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|txt|doc|docx|csv|json/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Files must be images or documents!');
    }
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

async function uploadFileToGemini(filePath, mimeType) {
  try {
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString('base64');
    
    const uploadResponse = await fetch(
      `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'X-Goog-Upload-Protocol': 'multipart',
          'Content-Type': 'multipart/related; boundary=boundary'
        },
        body: [
          '--boundary',
          'Content-Type: application/json; charset=UTF-8',
          '',
          JSON.stringify({
            file: {
              display_name: path.basename(filePath),
              mime_type: mimeType
            }
          }),
          '--boundary',
          `Content-Type: ${mimeType}`,
          'Content-Transfer-Encoding: base64',
          '',
          base64Data,
          '--boundary--'
        ].join('\r\n')
      }
    );
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }
    
    const uploadResult = await uploadResponse.json();
    return uploadResult.file;
  } catch (error) {
    console.error('Error uploading file to Gemini:', error);
    throw error;
  }
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.csv': 'text/csv',
    '.json': 'application/json'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}


app.post('/api/chat', upload.array('files', 5), async (req, res) => {
  try {
    const { messages } = req.body;
    const files = req.files || [];

    const parsedMessages = typeof messages === 'string' ? JSON.parse(messages) : messages;

    const contents = [];
    
    for (const msg of parsedMessages) {
      const content = {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: []
      };

      if (msg.content) {
        content.parts.push({ text: msg.content });
      }

      if (msg.role === 'user' && files.length > 0 && msg === parsedMessages[parsedMessages.length - 1]) {
        for (const file of files) {
          try {
            const mimeType = getMimeType(file.path);

            if (mimeType.startsWith('image/')) {
              const imageData = fs.readFileSync(file.path);
              const base64Data = imageData.toString('base64');
              content.parts.push({
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              });
            } else {
              if (mimeType === 'text/plain' || mimeType === 'text/csv' || mimeType === 'application/json') {
                const fileContent = fs.readFileSync(file.path, 'utf-8');
                content.parts.push({ 
                  text: `File: ${file.originalname}\nContent:\n${fileContent}` 
                });
              } else {
                content.parts.push({ 
                  text: `File uploaded: ${file.originalname} (${mimeType})` 
                });
              }
            }

            fs.unlinkSync(file.path);
          } catch (fileError) {
            console.error('Error processing file:', fileError);
            content.parts.push({ 
              text: `Error processing file: ${file.originalname}` 
            });
          }
        }
      }
      
      contents.push(content);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Gemini API error: ${data.error?.message || 'Unknown error'}`);
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    console.log('Gemini reply:', reply);
    res.json({ reply });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
