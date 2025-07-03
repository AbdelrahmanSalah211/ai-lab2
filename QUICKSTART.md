# Quick Start Guide

## 🚀 Get your GPT Clone with File Upload running in 5 minutes!

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies  
cd ..
npm install
```

### Step 2: Set up API Key

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create `.env` file in the `server` folder:

```bash
cd server
echo "GEMINI_API_KEY=your_api_key_here" > .env
echo "PORT=5000" >> .env
```

### Step 3: Start the Application

Open two terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### Step 4: Open in Browser

Go to: `http://localhost:5173`

## 🎯 Features You Can Test

### ✅ Text Chat
- Type any message and press Enter
- Get responses from Gemini AI

### ✅ Image Upload  
- Click the 📎 button
- Select an image (JPEG, PNG, GIF)
- Ask "What do you see in this image?"

### ✅ File Upload
- Upload text files, PDFs, CSVs
- Ask questions about the file content

### ✅ Multi-file Upload
- Select multiple files at once
- Get analysis of all files together

## 🔧 Troubleshooting

**Server won't start?**
- Check your API key in `.env`
- Make sure port 5000 is free

**File upload not working?**
- Check file size (max 20MB)
- Verify file type is supported

**Getting API errors?**
- Verify your Gemini API key is valid
- Check your Google Cloud quota

## 📝 Next Steps

- Check `SETUP.md` for detailed documentation
- Customize the UI in `src/App.css`
- Add new file types in `server/index.js`
- Implement drag & drop upload

Enjoy your AI-powered chat application! 🎉
