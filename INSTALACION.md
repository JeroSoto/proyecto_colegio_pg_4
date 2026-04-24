# Instalación y Ejecución - Proyecto Colegio

## Requisitos Previos

- **Node.js** v14 o superior
- **npm** (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

## Pasos de Instalación

### 1. Navegar a la carpeta del proyecto

```bash
cd c:\Users\JERONIMO\Downloads\PROYECTO_COLEGIO
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará:
- **express**: Framework web
- **sqlite3**: Base de datos
- **jsonwebtoken**: Autenticación
- **bcrypt**: Encriptación de contraseñas
- **dotenv**: Variables de entorno
- **axios**: Cliente HTTP para IA

### 3. Configurar variables de entorno

Abre el archivo `.env` y configura:

```env
PORT=3000
DATABASE_FILE=./data/school.db
JWT_SECRET=tu_clave_secreta_aqui
AI_PROVIDER=gemini
GEMINI_API_KEY=tu_clave_gemini_aqui
OPENAI_API_KEY=tu_clave_openai_aqui
```

**Para obtener claves de IA:**

- **Gemini**: https://ai.google.dev
- **OpenAI**: https://platform.openai.com/api-keys

### 4. Iniciar el servidor

```bash
npm start
```

Verás un mensaje como:
```
Conectado a la base de datos SQLite en ./data/school.db
Servidor escuchando en http://localhost:3000
```

### 5. Acceder a la aplicación

Abre tu navegador y ve a: **http://localhost:3000**

## Primeros Pasos

### Registrar un Profesor

1. En la página de login, selecciona la pestaña "Profesor"
2. Haz clic en "Registrarse"
3. Completa los campos:
   - Nombres, Apellidos
   - Correo electrónico
   - Número de documento
   - Grado asignado (0-11)
   - Materia
   - Contraseña (mínimo 8 caracteres)

### Registrar un Estudiante

1. En la página de login, selecciona la pestaña "Estudiante"
2. Haz clic en "Registrarse"
3. Completa los campos:
   - Nombres, Apellidos
   - Número de documento
   - Grado (0-11)
   - Contraseña (mínimo 8 caracteres)

### Ingresar Calificaciones (Como Profesor)

1. Inicia sesión con tu cuenta de profesor
2. Verás una tabla con los estudiantes de tu grado
3. Ingresa las notas en los campos (0-5)
4. Selecciona el trimestre (1-4)
5. Haz clic en "Guardar Todas las Calificaciones"

### Ver Calificaciones (Como Estudiante)

1. Inicia sesión con tu cuenta de estudiante
2. En el portal verás todas tus calificaciones
3. Puedes hacer preguntas al asistente IA

## Testing con Thunder Client

1. Instala la extensión **Thunder Client** en VS Code
2. Abre Thunder Client
3. Importa el archivo: `docs/THUNDER_CLIENT.json`
4. Usa las rutas predefinidas para probar la API

**Nota**: Reemplaza `YOUR_TOKEN_HERE` con un token JWT válido obtenido del login.

## Estructura de Carpetas

```
PROYECTO_COLEGIO/
├── app.js                      # Servidor principal
├── package.json                # Dependencias
├── .env                        # Variables de entorno
├── models/                     # Modelos de datos
├── routes/                     # Rutas API
├── public/                     # Archivos estáticos
│   ├── html/                   # Páginas HTML
│   ├── css/                    # Estilos
│   └── js/                     # Scripts
├── data/                       # Base de datos (se crea automáticamente)
└── docs/                       # Documentación

```

## Solución de Problemas

### Puerto 3000 ya está en uso

Si el puerto 3000 está ocupado, cambia en `.env`:
```
PORT=3001
```

### Error de base de datos

Elimina la carpeta `data/` para reiniciar la base de datos:
```bash
rmdir /s data
```

El servidor la recréará automáticamente al iniciar.

### Módulos no encontrados

Si ves errores de módulos, reinstala las dependencias:
```bash
rmdir /s node_modules
npm install
```

### Las claves de IA no funcionan

Verifica que:
1. Las claves están correctas en `.env`
2. Tienes acceso activo a la API
3. No has excedido el límite de uso

## Documentación Adicional

- `docs/README.md` - Descripción general del proyecto
- `docs/REQUISITOS.md` - Requisitos funcionales y no funcionales
- `docs/API.md` - Documentación completa de la API
- `docs/THUNDER_CLIENT.json` - Rutas para pruebas

## Soporte

Para reportar problemas o sugerencias, contacta al administrador del proyecto.
