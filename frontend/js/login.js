document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('formularioLogin');
    if (!loginForm) {
        return; 
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const loginError = document.getElementById('loginError');
        loginError.textContent = ''; 

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            loginError.textContent = 'Por favor, ingresa tu email y contraseña.';
            return;
        }

        const loginButton = document.getElementById('login-boton');
        loginButton.disabled = true;
        loginButton.textContent = 'Ingresando...';

        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                alert('¡Inicio de sesión exitoso!');
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'turnos.html'; 
            } else {
                loginError.textContent = data.message || 'Error al iniciar sesión.';
            }
        } catch (error) {
            console.error('Error de red al intentar iniciar sesión:', error);
            loginError.textContent = 'No se pudo conectar con el servidor. Inténtalo más tarde.';
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Iniciar sesión';
        }
    });
});