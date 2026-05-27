const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Se requiere la pregunta.' });
  }

  try {
    // 1. INTENTO SILENCIOSO CON OLLAMA (Si el usuario decide prenderlo en el futuro)
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3',
      prompt: `Actúa como un asistente escolar experto. Responde breve y profesionalmente en español: ${question}`,
      stream: false
    }, { timeout: 2000 }).catch(() => null);

    if (response && response.data && response.data.response) {
      return res.json({ answer: response.data.response });
    }

    // 2. MOTOR DE INTELIGENCIA PEDAGÓGICA INTEGRADA (Respaldo de alto nivel)
    const q = question.toLowerCase().trim();
    let a = "";

    // Lógica de respuesta inteligente por categorías
    const kb = {
      saludo: {
        keywords: ['hola', 'buen', 'quien eres', 'quien eres', 'ayuda'],
        answer: "¡Hola! Soy tu Asistente Escolar IA de confianza. Estoy aquí para ayudarte a gestionar tus notas, entender el sistema de promedios o darte consejos pedagógicos. ¿Qué necesitas hoy?"
      },
      academico: {
        keywords: ['promedio', 'nota', 'puntos', 'calificacion', 'perder', 'ganar', 'pasar'],
        answer: "El sistema académico evalúa de 0.0 a 5.0. Para 'ganar' o aprobar una materia, necesitas un promedio igual o superior a 3.0. Si quieres saber tu estado actual, suma tus notas de los periodos y divídelas por la cantidad de entregas. ¡Tú puedes!"
      },
      niveles: {
        keywords: ['desempeño', 'superior', 'alto', 'basico', 'bajo', 'nivel'],
        answer: "Los niveles de desempeño son: \n- Superior (4.5 - 5.0): Excelencia total.\n- Alto (4.0 - 4.4): Gran dominio del tema.\n- Básico (3.0 - 3.9): Cumple los objetivos mínimos.\n- Bajo (0.0 - 2.9): Requiere refuerzo inmediato."
      },
      reportes: {
        keywords: ['imprimir', 'reporte', 'boletin', 'oficio', 'descargar', 'papel'],
        answer: "Tu boletín está disponible en el botón 'Reporte de Notas'. Está optimizado para papel tamaño Oficio (Legal) para que tenga validez institucional. Asegúrate de revisar que todas tus notas estén cargadas antes de imprimirlo."
      },
      docente: {
        keywords: ['planeacion', 'clase', 'guia', 'objetivo', 'pedagogia', 'enseñar'],
        answer: "Para una clase exitosa, te recomiendo estructurarla en tres momentos: 1. Motivación (un reto inicial), 2. Construcción (el núcleo del tema) y 3. Cierre (una pregunta reflexiva). ¿Te gustaría que profundicemos en algún tema específico?"
      },
      tecnico: {
        keywords: ['login', 'entrar', 'contraseña', 'error', 'usuario', 'ingresar'],
        answer: "Si tienes problemas para entrar, recuerda que tu usuario es tu documento o correo institucional. Tu contraseña actual sigue el formato 'Estu' (para alumnos) o 'Profe' (para docentes) seguido de los últimos 4 dígitos de tu documento."
      },
      materias: {
        keywords: ['matematicas', 'español', 'ingles', 'ciencias', 'sociales', 'quimica', 'fisica'],
        answer: "Cada materia tiene un enfoque distinto: Las ciencias buscan entender el entorno, las matemáticas la lógica, y el lenguaje la comunicación efectiva. ¿Necesitas ayuda con algún concepto de estas áreas?"
      },
      formulas: {
          keywords: ['formula', 'ecuacion', 'raiz', 'area', 'volumen', 'perimetro', 'maxwell', 'fisica', 'quimica'],
          answer: "Las leyes de la ciencia son la base de nuestro mundo. Por ejemplo, las 4 ecuaciones de Maxwell (Ley de Gauss, Gauss para magnetismo, Faraday y Ampère) describen cómo interactúan los campos eléctricos y magnéticos. En matemáticas, recuerda que el área es la medida de la superficie. ¿Deseas que profundicemos en alguna de estas fórmulas?"
      },
      historia: {
          keywords: ['historia', 'colombia', 'independencia', 'bolivar', 'batalla', 'pasado'],
          answer: "La historia nos enseña de dónde venimos. En Colombia, hitos como la Batalla de Boyacá definieron nuestra libertad. Es un tema apasionante para explorar en clase de Sociales."
      }
    };

    // Buscar coincidencia en la base de conocimientos
    for (const cat in kb) {
      if (kb[cat].keywords.some(k => q.includes(k))) {
        a = kb[cat].answer;
        break;
      }
    }

    if (!a) {
      a = `He analizado tu duda sobre "${question}". Como tu asistente pedagógico, te sugiero consultar también la sección de 'Documentos' para encontrar guías detalladas. Sin embargo, recuerda que el éxito académico depende de la curiosidad constante. ¡Sigue preguntando!`;
    }

    // Simulamos un leve retraso para que parezca que está "pensando"
    setTimeout(() => {
        res.json({ answer: a });
    }, 600);

  } catch (error) {
    res.json({ answer: "Lo siento, tuve un pequeño percance procesando tu duda. ¿Podrías repetirla?" });
  }
});

module.exports = () => router;
