# GPT Clone with Gemini API and File Upload Support

A modern chat application built with React and Node.js that integrates with Google's Gemini API and supports image and file uploads.

## Features

- 💬 **Real-time Chat**: Chat with Google's Gemini AI model
- 📸 **Image Upload**: Upload and analyze images (JPEG, PNG, GIF)
- 📄 **File Upload**: Upload and process various file types:
  - Documents: PDF, DOC, DOCX
  - Text files: TXT, CSV, JSON
- 🔄 **Multi-file Support**: Upload up to 5 files at once
- 🎨 **Modern UI**: Clean and responsive design
- ⚡ **Fast Processing**: Optimized for quick responses

## Prerequisites

- Node.js (v20 or higher)
- Google Gemini API key
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gpt-clone
```

### 2. Install Dependencies

Install backend dependencies:
```bash
cd server
npm install
```

Install frontend dependencies:
```bash
cd ..
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```

### 4. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key and paste it in your `.env` file

### 5. Run the Application

Start the backend server:
```bash
cd server
npm start
```

Start the frontend (in a new terminal):
```bash
cd ..
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Text Chat
1. Type your message in the input field
2. Press Enter or click "Send"
3. Wait for Gemini's response

### File Upload
1. Click the 📎 (paperclip) button to select files
2. Choose one or multiple files (images, documents, text files)
3. Selected files will appear in the preview area
4. Add an optional text message
5. Click "Send" to upload and analyze

### Supported File Types
- **Images**: JPEG, JPG, PNG, GIF (up to 20MB each)
- **Documents**: PDF, DOC, DOCX (text content will be extracted)
- **Text Files**: TXT, CSV, JSON (content will be read and analyzed)

## File Processing

- **Images**: Sent directly to Gemini for visual analysis
- **Text Files**: Content is read and included in the conversation
- **Other Documents**: File information is provided to Gemini

## API Endpoints

### POST `/api/chat`
- **Description**: Send a message with optional file uploads
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `messages`: JSON string of conversation history
  - `files`: Array of uploaded files (optional)

## Project Structure

```
├── src/
│   ├── App.tsx          # Main React component
│   ├── App.css          # Styles
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── server/
│   ├── index.js         # Express server
│   ├── package.json     # Server dependencies
│   └── .env             # Environment variables
├── package.json         # Frontend dependencies
└── README.md           # This file
```

## Technologies Used

### Frontend
- React 19 with TypeScript
- Vite (build tool)
- CSS3 with modern features

### Backend
- Node.js with Express
- Multer (file upload handling)
- Google Gemini API
- CORS enabled

## Troubleshooting

### Common Issues

1. **"Cannot find module 'react'"**
   - Run `npm install` in the root directory

2. **Server not starting**
   - Check if port 5000 is available
   - Verify your Gemini API key in `.env`

3. **File upload not working**
   - Check file size (max 20MB)
   - Verify file type is supported
   - Ensure server has write permissions for uploads directory

4. **API errors**
   - Verify your Gemini API key is valid
   - Check your Google Cloud quota
   - Ensure you have access to Gemini API

### Development Tips

- Check browser console for frontend errors
- Check server logs for backend issues
- Use the browser's Network tab to debug API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Security Notes

- Never commit your `.env` file with real API keys
- The uploads directory is created automatically but files are cleaned up after processing
- File size limits are enforced to prevent abuse
- Only whitelisted file types are allowed

## Future Enhancements

- Image preview in chat
- Drag and drop file upload
- File type icons
- Chat history persistence
- User authentication
- File download capabilities
