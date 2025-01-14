import React, { useState } from 'react';
import {useCSVReader, formatFileSize } from 'react-papaparse';
import axios from 'axios';
import  PDFLoader  from "@langchain/community/document_loaders/fs/pdf";
const GREY = '#CCC';
const GREY_LIGHT = 'rgba(255, 255, 255, 0.4)';


const loader = new PDFLoader("C:/Users/U399819/Downloads/constitucion_tamaulipas.pdf");
  
const docs = await loader.load();
console.log(docs.length);


const Chatbot = () => {
  const [data, setData] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');



  
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };








  const handleAskQuestion = async () => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'ft:gpt-4o-2024-08-06:personal:my-politics-model:Aldm8DpF', // Specify the model parameter
        messages: [
          { role: 'system', content: `You are a helpful assistant.` },
          { role: 'user', content: `
          
          
          Eres un bot de experto en politica optimizado que asiste a los analistas de datos en tareas complejas. contesta la pregunta basada en la siguiente fuentes: ${JSON.stringify(data)}.
          
          
          
          
          ` }
        ],
       max_tokens:3000,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        }
      });
  
      setAnswer(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };


  return (

    
    <div>
      <h1>CSV Chatbot</h1>

      <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        placeholder="Ask a question"
      />
      <button onClick={handleAskQuestion}>Ask</button>
      <div>
        <h2>Answer:</h2>
        <p>{answer}</p>
      
      </div>
    </div>
  );
};

export default Chatbot;