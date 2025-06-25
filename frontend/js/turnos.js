document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userNameSpan = document.getElementById('user-name');
    const memberTypeSpan = document.getElementById('member-type');
    
    if(userNameSpan) userNameSpan.textContent = user.email.split('@')[0];
    if(memberTypeSpan) memberTypeSpan.textContent = user.member_type;

    document.getElementById('logout-button')?.addEventListener('click', handleLogout);
    document.getElementById('upgrade-clasica')?.addEventListener('click', () => changeMembership('clasica'));
    document.getElementById('upgrade-black')?.addEventListener('click', () => changeMembership('black'));
    document.getElementById('upgrade-soloclases')?.addEventListener('click', () => changeMembership('soloclases'));
    
    updateViewBasedOnMembership(user.member_type);
    
    document.addEventListener('click', function(e) {
        if (e.target && e.target.matches('.book-button')) {
            bookActivity(e.target.dataset.id, e.target.dataset.type, e.target);
        }
        if (e.target && e.target.matches('.cancel-button')) {
            cancelActivity(e.target.dataset.id, e.target.dataset.type, e.target);
        }
    });
});

function updateViewBasedOnMembership(memberType) {
    const turnosSection = document.getElementById('turnos-section');
    const clasesSection = document.getElementById('clases-section');

    const canAccessClases = ['black', 'soloclases'].includes(memberType);
    const canAccessTurnos = ['black', 'clasica'].includes(memberType);

    if (clasesSection) clasesSection.style.display = canAccessClases ? 'block' : 'none';
    if (turnosSection) turnosSection.style.display = canAccessTurnos ? 'block' : 'none';
    
    if (canAccessTurnos) fetchAndRenderActivities('turno');
    if (canAccessClases) fetchAndRenderActivities('clase');
}

async function handleLogout(e) {
    if(e) e.preventDefault();
    await fetch('http://127.0.0.1:5000/api/logout', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

async function fetchAndRenderActivities(type) {
    const container = document.getElementById(`${type}s-container`);
    if (!container) return;
    container.innerHTML = `<p class="loading-message">Cargando ${type}s...</p>`;
    try {
        const [activitiesResponse, bookingsResponse] = await Promise.all([
            fetch(`http://127.0.0.1:5000/api/${type}s`, { credentials: 'include' }),
            fetch('http://127.0.0.1:5000/api/user/bookings', { credentials: 'include' })
        ]);
        
        if (!activitiesResponse.ok) throw new Error(`No se pudieron cargar los ${type}s.`);
        
        const activities = await activitiesResponse.json();
        const userBookings = bookingsResponse.ok ? await bookingsResponse.json() : { turnos: [], clases: [] };
        
        container.innerHTML = '';
        if (activities.length === 0) {
            container.innerHTML = `<p>No hay ${type}s disponibles.</p>`;
            return;
        }

        activities.forEach(activity => {
            const isBooked = userBookings[`${type}s`].includes(activity.id);
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${activity.name}</h4>
                <p>${type === 'turno' ? `Horario: ${activity.time}` : `Instructor: ${activity.instructor}`}</p>
                <div class="button-group">
                    <button 
                        class="book-button" 
                        data-id="${activity.id}" 
                        data-type="${type}"
                        style="display: ${isBooked ? 'none' : 'inline-block'};">
                        Anotarse
                    </button>
                    <button 
                        class="cancel-button" 
                        data-id="${activity.id}" 
                        data-type="${type}"
                        style="display: ${isBooked ? 'inline-block' : 'none'};">
                        Cancelar
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

async function bookActivity(id, type, button) {
    await handleActivityAction('book', id, type, button);
}

async function cancelActivity(id, type, button) {
    await handleActivityAction('cancel', id, type, button);
}

async function handleActivityAction(action, id, type, button) {
    const url = `http://127.0.0.1:5000/api/${type}s/${id}/${action}`;
    const originalButtonSibling = action === 'book' ? button.nextElementSibling : button.previousElementSibling;
    
    button.style.display = 'none';

    try {
        const response = await fetch(url, { method: 'POST', credentials: 'include' });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            originalButtonSibling.style.display = 'inline-block';
        } else {
            button.style.display = 'inline-block';
        }
    } catch (error) {
        alert('Hubo un problema. Inténtalo de nuevo.');
        button.style.display = 'inline-block';
    }
}

async function changeMembership(newType) {
    if (!confirm(`¿Confirmas que quieres cambiar tu membresía a ${newType}?`)) return;
    try {
        const response = await fetch('http://127.0.0.1:5000/api/user/membership', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ member_type: newType })
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.reload();
        }
    } catch (error) {
        alert("Error al intentar cambiar tu membresía.");
    }
}