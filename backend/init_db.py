from app import create_app
from models import db, Turno, Clase

app = create_app()

with app.app_context():
    print("Creando todas las tablas...")
    db.create_all()
    
    print("Insertando datos de ejemplo (si no existen)...")
    if Turno.query.count() == 0:
        for t_data in [
            {'name': 'Musculación Mañana', 'time': '08:00 - 10:00'},
            {'name': 'Musculación Tarde', 'time': '14:00 - 16:00'},
            {'name': 'Musculación Noche', 'time': '19:00 - 21:00'}
        ]:
            db.session.add(Turno(**t_data))
    
    if Clase.query.count() == 0:
        for c_data in [
            {'name': 'Yoga', 'instructor': 'Ana'},
            {'name': 'Spinning', 'instructor': 'Carlos'},
            {'name': 'CrossFit', 'instructor': 'Laura'}
        ]:
            db.session.add(Clase(**c_data))
            
    db.session.commit()
    print("¡Base de datos lista!")
