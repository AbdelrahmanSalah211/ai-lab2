import React, { useState, useRef } from 'react';
import './App.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  files?: File[];
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;
    
    const newMessage: Message = { 
      role: 'user', 
      content: input || 'File(s) uploaded',
      files: selectedFiles.length > 0 ? selectedFiles : undefined
    };
    
    const newMessages: Message[] = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('messages', JSON.stringify(newMessages));
      
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      const assistantReply = data.reply || 'No response';
      setMessages([...newMessages, { role: 'assistant', content: assistantReply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Error contacting server.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <h1>GPT Chat with File Upload</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <div>{msg.content}</div>
            {msg.files && msg.files.length > 0 && (
              <div className="message-files">
                {msg.files.map((file, fileIdx) => (
                  <div key={fileIdx} className="file-info">
                    📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="chat-message assistant">...</div>}
      </div>

      {selectedFiles.length > 0 && (
        <div className="file-preview">
          <h4>Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <span className="file-name">📎 {file.name}</span>
              <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
              <button 
                className="remove-file" 
                onClick={() => removeFile(index)}
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="chat-input">
        <div className="input-row">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type your message..."
            disabled={loading}
            className="text-input"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*,.pdf,.txt,.doc,.docx,.csv,.json"
            style={{ display: 'none' }}
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={loading}
            className="file-button"
            type="button"
          >
            📎
          </button>
          <button 
            onClick={sendMessage} 
            disabled={loading || (!input.trim() && selectedFiles.length === 0)}
            className="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
