document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formularioRegistro");
    if (!formulario) return;

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();
        const nombreValido = validarNombre();
        const apellidoValido = validarApellido();
        const emailValido = validarEmail();
        const telefonoValido = validarTelefono();
        const fechaValida = validarFecha();
        const contraseñaValida = validarContraseña();
        const confirmarContraseñaValida = validarConfirmarContraseña();

        if (nombreValido && apellidoValido && emailValido && telefonoValido && fechaValida
            && contraseñaValida && confirmarContraseñaValida) {
            registrarUsuario();
        }
    });

    const campoNombre = document.getElementById("nombre");
    const campoApellido = document.getElementById("apellido");
    const campoEmail = document.getElementById("email");
    const campoTelefono = document.getElementById("telefono");
    const campoFecha = document.getElementById("fecha");
    const campoContraseña = document.getElementById("contraseña");
    const campoConfirmar_contraseña = document.getElementById("confirmarContraseña");

    campoNombre.addEventListener("input", validarNombre);
    campoNombre.addEventListener("blur", validarNombre);
    campoApellido.addEventListener("input", validarApellido);
    campoApellido.addEventListener("blur", validarApellido);
    campoEmail.addEventListener("input", validarEmail);
    campoEmail.addEventListener("blur", validarEmail);
    campoTelefono.addEventListener("input", validarTelefono);
    campoTelefono.addEventListener("blur", validarTelefono);
    campoFecha.addEventListener("input", validarFecha);
    campoFecha.addEventListener("blur", validarFecha);
    campoContraseña.addEventListener("input", () => {
        validarContraseña();
        validarConfirmarContraseña();
    });
    campoContraseña.addEventListener("blur", () => {
        validarContraseña();
        validarConfirmarContraseña();
    });
    campoConfirmar_contraseña.addEventListener("input", validarConfirmarContraseña);
    campoConfirmar_contraseña.addEventListener("blur", validarConfirmarContraseña);
});

async function registrarUsuario() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const fecha = document.getElementById("fecha").value;
    const password = document.getElementById("contraseña").value;
    
    const boton = document.getElementById('signup-boton');
    boton.disabled = true;
    boton.textContent = 'Registrando...';

    try {
        const response = await fetch('https://gym-api-5hyh.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nombre,
                lastname: apellido,
                email: email,
                birth_date: fecha,
                password: password
            }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            mostrarExito();
        } else {
            const errorEmail = document.getElementById('error-email');
            errorEmail.textContent = data.message || 'Ocurrió un error en el servidor.';
        }

    } catch (error) {
        console.error('Error de red:', error);
        const errorGeneral = document.getElementById('error-confirmarContraseña');
        errorGeneral.textContent = 'No se pudo conectar con el servidor. Inténtalo más tarde.';
    } finally {
        boton.disabled = false;
        boton.textContent = 'Registrarse';
    }
}

function mostrarExito() {
    const formulario = document.getElementById("formularioRegistro");
    const successMessageContainer = document.getElementById("success-message");

    if (successMessageContainer) {
        successMessageContainer.textContent = "¡Registro exitoso! Redirigiendo a inicio de sesión...";
        successMessageContainer.style.color = "green";
        formulario.reset();
        setTimeout(() => {
            window.location.href = "login.html";
        }, 3000);
    }
}

function validarNombre() {
    const nombre = document.getElementById("nombre").value.trim();
    const error = document.getElementById("error-nombre");
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
    if (nombre === "") {
        error.textContent = "El nombre es obligatorio."; return false;
    } else if (!regex.test(nombre)) {
        error.textContent = "Debe ingresar únicamente letras (mínimo 3)."; return false;
    } else {
        error.textContent = ''; return true;
    }
}

function validarApellido() {
    const apellido = document.getElementById("apellido").value.trim();
    const error = document.getElementById("error-apellido");
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
    if (apellido === "") {
        error.textContent = "El apellido es obligatorio."; return false;
    } else if (!regex.test(apellido)) {
        error.textContent = "Debe ingresar únicamente letras (mínimo 3)."; return false;
    } else {
        error.textContent = ''; return true;
    }
}

function validarEmail() {
    const email = document.getElementById("email").value.trim();
    const error = document.getElementById("error-email");
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === '') {
        error.textContent = "El e-mail es obligatorio."; return false;
    } else if (!regex.test(email)) {
        error.textContent = "Debe ingresar un e-mail válido"; return false;
    } else {
        error.textContent = ''; return true;
    }
}

function validarTelefono() {
    const telefono = document.getElementById("telefono").value.trim();
    const error = document.getElementById("error-telefono");
    const regex = /^\+?[\d\s\-().]{6,}$/;
    if (!telefono) {
        error.textContent = "El teléfono es obligatorio."; return false;
    } else if (!regex.test(telefono)) {
        error.textContent = "Debe ingresar un teléfono válido"; return false;
    } else {
        error.textContent = ''; return true;
    }
}

function validarFecha() {
    const fecha = document.getElementById("fecha").value.trim();
    const error = document.getElementById("error-fecha");
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    if (fecha === '') {
        error.textContent = "La fecha de nacimiento es obligatoria."; return false;
    } else if (fechaSeleccionada > hoy) {
        error.textContent = "La fecha no puede ser posterior a hoy."; return false;
    } else {
        error.textContent = ''; return true;
    }
}

function validarContraseña() {
    const contraseña = document.getElementById("contraseña").value.trim();
    const error = document.getElementById("error-contraseña");
    const tieneLongitud = contraseña.length >= 6;
    if (!tieneLongitud) {
        error.textContent = "La contraseña debe tener al menos 6 caracteres."; return false;
    } else {
        error.textContent = ""; return true;
    }
}

function validarConfirmarContraseña() {
    const confirmarContraseña = document.getElementById("confirmarContraseña").value.trim();
    const error = document.getElementById("error-confirmarContraseña");
    const contraseña = document.getElementById("contraseña").value.trim();
    if (confirmarContraseña === contraseña) {
        error.textContent = ""; return true;
    } else {
        error.textContent = "Las contraseñas no coinciden."; return false;
    }
}