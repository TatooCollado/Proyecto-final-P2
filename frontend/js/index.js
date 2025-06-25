document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem('user'));
    const authLinksContainer = document.getElementById('auth-links');
    const mainNav = document.getElementById('main-nav');
    const navAuthLinks = mainNav ? mainNav.querySelector('.login-signup-nav') : null;

    if (user && authLinksContainer) {
        authLinksContainer.innerHTML = `
            <a href="turnos.html">Mis Turnos</a>
            <a href="#" id="logout-button">Cerrar Sesión</a>
        `;

        if (navAuthLinks) {
            navAuthLinks.innerHTML = `
                <li><a href="turnos.html">Mis Turnos</a></li>
                <li><a href="#" id="logout-button-nav">Cerrar Sesión</a></li>
            `;
        }
        
        const setupLogout = (buttonId) => {
            const logoutButton = document.getElementById(buttonId);
            if (logoutButton) {
                logoutButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        const response = await fetch('http://127.0.0.1:5000/api/logout', { 
                            method: 'POST',
                            credentials: 'include'
                        });
                        if (response.ok) {
                            localStorage.removeItem('user');
                            alert('Has cerrado sesión.');
                            window.location.href = 'index.html';
                        }
                    } catch (error) {
                        console.error('Error al cerrar sesión:', error);
                    }
                });
            }
        };
        setupLogout('logout-button');
        setupLogout('logout-button-nav');
    }

    const formulario = document.getElementById("formularioContacto");
    if (!formulario) return;

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();
        const nombreValido = validarNombre();
        const apellidoValido = validarApellido();
        const emailValido = validarEmail();
        const razonValida = validarRazon();
        const comentarioValido = validarComentario();
        if (nombreValido && apellidoValido && emailValido && razonValida && comentarioValido) {
            mostrarExito();
        }
    });

    const campoNombre = document.getElementById("nombre");
    const campoApellido = document.getElementById("apellido");
    const campoEmail = document.getElementById("email");
    const campoRazon = document.getElementById("razon");
    const campoComentario = document.getElementById("comentario");

    if (campoNombre) campoNombre.addEventListener("input", validarNombre);
    if (campoNombre) campoNombre.addEventListener("blur", validarNombre);
    if (campoApellido) campoApellido.addEventListener("input", validarApellido);
    if (campoApellido) campoApellido.addEventListener("blur", validarApellido);
    if (campoEmail) campoEmail.addEventListener("input", validarEmail);
    if (campoEmail) campoEmail.addEventListener("blur", validarEmail);
    if (campoRazon) campoRazon.addEventListener("change", validarRazon);
    if (campoRazon) campoRazon.addEventListener("blur", validarRazon);
    if (campoComentario) campoComentario.addEventListener("input", validarComentario);
    if (campoComentario) campoComentario.addEventListener("blur", validarComentario);

    function mostrarExito() {
        const mensajeExito = document.getElementById("mensaje-exito");
        if (mensajeExito) {
            mensajeExito.textContent = "Formulario enviado con éxito!";
            mensajeExito.style.color = "green";
            formulario.reset();
            setTimeout(() => {
                mensajeExito.textContent = "";
            }, 5000);
        }
    }

    function validarNombre() {
        const nombre = campoNombre.value.trim();
        const error = document.getElementById("error-nombre");
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
        if (nombre === "") {
            error.textContent = "El nombre es obligatorio."; return false;
        } else if (!regex.test(nombre)) {
            error.textContent = "Debe ingresar solo letras (mínimo 3)."; return false;
        } else {
            error.textContent = ""; return true;
        }
    }

    function validarApellido() {
        const apellido = campoApellido.value.trim();
        const error = document.getElementById("error-apellido");
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
        if (apellido === "") {
            error.textContent = "El apellido es obligatorio."; return false;
        } else if (!regex.test(apellido)) {
            error.textContent = "Debe ingresar solo letras (mínimo 3)."; return false;
        } else {
            error.textContent = ""; return true;
        }
    }

    function validarEmail() {
        const email = campoEmail.value.trim();
        const error = document.getElementById("error-email");
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email === "") {
            error.textContent = "El e-mail es obligatorio."; return false;
        } else if (!regex.test(email)) {
            error.textContent = "Debe ingresar un e-mail válido."; return false;
        } else {
            error.textContent = ""; return true;
        }
    }

    function validarRazon() {
        const razon = campoRazon.value;
        const error = document.getElementById("error-razon");
        if (!razon) {
            error.textContent = "Debe seleccionar una razón."; return false;
        } else {
            error.textContent = ""; return true;
        }
    }

    function validarComentario() {
        const comentario = campoComentario.value.trim();
        const error = document.getElementById("error-comentario");
        if (comentario.length < 10) {
            error.textContent = "El mensaje debe tener al menos 10 caracteres."; return false;
        } else {
            error.textContent = ""; return true;
        }
    }
});