https://proyecto-final-p2.onrender.com ---> deployada



Gimnasio Web App - Proyecto Final
Este es el proyecto final del curso, una aplicación web full-stack para la gestión de un gimnasio. Permite a los usuarios registrarse, iniciar sesión, ver y anotarse a turnos y clases según su tipo de membresía.

✨ Características Principales
Registro de Usuarios: Creación de nuevas cuentas con validación de datos.
Inicio y Cierre de Sesión: Sistema de autenticación basado en sesiones.
Panel de Usuario: Página personalizada donde los usuarios pueden ver sus actividades.
Gestión de Turnos: Los usuarios pueden ver los turnos de musculación disponibles y anotarse.
Gestión de Clases: Los miembros con membresía "Black" o "Solo Clases" pueden ver y anotarse a clases exclusivas.
Manejo de Membresías: El acceso a las funcionalidades está restringido por el tipo de membresía (Clasica, Black, Solo Clases).
Cambio de Membresía: Funcionalidad para que los usuarios actualicen su tipo de membresía.
🚀 Tecnologías Utilizadas
Backend
Python 3: Lenguaje de programación principal.
Flask: Micro-framework web para construir la API REST.
SQLAlchemy: ORM para interactuar con la base de datos de una forma pythónica.
SQLite: Base de datos ligera y basada en archivos, perfecta para desarrollo y proyectos pequeños.
Werkzeug: Para el hash seguro de contraseñas.
Flask-CORS: Para manejar las políticas de Cross-Origin Resource Sharing.
Frontend
HTML5: Estructura de las páginas web.
CSS3: Estilos y diseño responsivo.
JavaScript (ES6+): Interactividad del lado del cliente y comunicación con el backend (API Fetch).
🔧 Instalación y Configuración
Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

Prerrequisitos
Tener Python 3 instalado.
Se recomienda usar Visual Studio Code con la extensión Live Server.
1. Clonar el Repositorio
git clone https://github.com/TatooCollado/Proyecto-final-P2.git
2. Configurar el Backend
Navega a la carpeta del backend y crea un entorno virtual.

cd backend
python -m venv venv
Activa el entorno virtual:

En Windows (PowerShell): .\venv\Scripts\Activate.ps1
En macOS/Linux: source venv/bin/activate
Instala las dependencias de Python:

pip install -r requirements.txt
(Si no tienes un requirements.txt, puedes instalar las librerías manualmente: pip install Flask Flask-SQLAlchemy Flask-CORS Werkzeug)

3. Inicializar la Base de Datos
Ejecuta este comando una sola vez para crear la base de datos gym.db y llenarla con datos de ejemplo (turnos y clases).

python init_db.py
▶️ Cómo Ejecutar la Aplicación
Para correr el proyecto, necesitas tener dos terminales abiertas: una para el backend y otra para el frontend.

1. Iniciar el Servidor Backend
En tu primera terminal (dentro de la carpeta backend/ y con el entorno virtual activado):

flask --app wsgi:app run
El servidor backend estará corriendo en http://127.0.0.1:5000. ¡Déjalo funcionando!

2. Iniciar el Servidor Frontend
En Visual Studio Code, ve a la carpeta frontend/views/, haz clic derecho en el archivo index.html y selecciona "Open with Live Server".

Esto abrirá la página web en tu navegador en una dirección como http://127.0.0.1:5500.

¡Y listo! La aplicación está en marcha. Ya puedes registrarte, iniciar sesión y probar todas las funcionalidades.
o fue desarrollado como parte de un curso. Las contribuciones son bienvenidas. Para contribuir:


👨‍💻 Autores
Diaz, Jeniffer.
Jabazze, Carlos.
Di Monaco, Florencia.
Collado, Ignacio.
