const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Se requiere la pregunta en el cuerpo de la solicitud.' });
  }

  try {
    const provider = process.env.AI_PROVIDER?.toLowerCase() || 'openai';
    let responseText = '';

    if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
      const url = `https://gemini.googleapis.com/v1/models/${process.env.GEMINI_MODEL || 'gemini-1.5-mini'}:generate`;
      const response = await axios.post(
        url,
        {
          prompt: question,
          max_output_tokens: 300
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      responseText = response.data?.candidates?.[0]?.content || 'No se recibió respuesta de Gemini.';
    } else if (process.env.OPENAI_API_KEY) {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: question }],
          max_tokens: 300
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      responseText = response.data?.choices?.[0]?.message?.content || 'No se recibió respuesta del asistente.';
    } else {
      return res.status(500).json({ error: 'No hay clave de IA configurada en .env.' });
    }

    res.json({ answer: responseText });
  } catch (error) {
    console.error('Error en el asistente IA:', error.message || error);
    res.status(500).json({ error: 'Error al conectar con el asistente IA.' });
  }
});

module.exports = () => router;
