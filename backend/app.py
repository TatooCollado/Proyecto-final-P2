from flask import Flask, request, jsonify, session
from flask_cors import CORS
from models import db, User, Turno, Clase
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

def create_app():
    app = Flask(__name__)
    
    # --- CONFIGURACIÓN SIMPLE Y DIRECTA ---
    app.config['SECRET_KEY'] = 'la-clave-mas-simple-y-efectiva'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gym.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicializar las extensiones
    CORS(app, supports_credentials=True, origins=['http://127.0.0.1:5500', 'http://localhost:5500'])
    db.init_app(app)

    # --- DECORADORES Y RUTAS (SIN CAMBIOS) ---
    def login_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                return jsonify({"message": "Acceso no autorizado."}), 401
            return f(*args, **kwargs)
        return decorated_function

    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        if not data: return jsonify({"message": "No se recibieron datos"}), 400
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        lastname = data.get('lastname')
        member_type = data.get('member_type', 'clasica') 
        birth_date = data.get('birth_date')
        if not all([email, password, name, lastname]): return jsonify({"message": "Faltan datos obligatorios"}), 400
        if User.query.filter_by(email=email).first(): return jsonify({"message": "El email ya está registrado"}), 409
        hashed_password = generate_password_hash(password)
        new_user = User(email=email, password_hash=hashed_password, name=name, lastname=lastname, birth_date=birth_date, member_type=member_type)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Usuario registrado con éxito"}), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password): return jsonify({"message": "Email o contraseña incorrectos"}), 401
        session.permanent = True # Hacemos la sesión "permanente" para que dure
        session['user_id'] = user.id
        session['member_type'] = user.member_type
        return jsonify({"message": "Login exitoso", "user": {"id": user.id, "email": user.email, "member_type": user.member_type}})

    @app.route('/api/logout', methods=['POST'])
    def logout():
        session.clear()
        return jsonify({"message": "Logout exitoso"})
        
    @app.route('/api/turnos', methods=['GET'])
    @login_required
    def get_turnos():
        user = User.query.get(session['user_id'])
        if user.member_type not in ['clasica', 'black']: return jsonify({"message": "No tienes acceso a los turnos."}), 403
        turnos = Turno.query.all()
        return jsonify([{"id": t.id, "name": t.name, "time": t.time} for t in turnos])

    @app.route('/api/clases', methods=['GET'])
    @login_required
    def get_clases():
        user = User.query.get(session['user_id'])
        if user.member_type not in ['black', 'soloclases']: return jsonify({"message": "No tienes acceso a las clases."}), 403
        clases = Clase.query.all()
        return jsonify([{"id": c.id, "name": c.name, "instructor": c.instructor} for c in clases])
    
    @app.route('/api/user/bookings', methods=['GET'])
    @login_required
    def get_user_bookings():
        user = User.query.get(session['user_id'])
        booked_turnos_ids = [turno.id for turno in user.booked_turnos]
        booked_clases_ids = [clase.id for clase in user.booked_clases]
        return jsonify({"turnos": booked_turnos_ids, "clases": booked_clases_ids})

    def handle_booking(action, activity_type, activity_id):
        user = User.query.get(session['user_id'])
        model = Turno if activity_type == 'turno' else Clase
        activity = model.query.get(activity_id)
        if not activity: return jsonify({"message": f"El {activity_type} no existe"}), 404
        
        bookings = user.booked_turnos if activity_type == 'turno' else user.booked_clases
        
        if action == 'book':
            if activity in bookings: return jsonify({"message": f"Ya estás anotado en este {activity_type}"}), 409
            bookings.append(activity)
            message = f"Te has anotado a {activity.name} con éxito"
        elif action == 'cancel':
            if activity not in bookings: return jsonify({"message": f"No estás anotado en este {activity_type}"}), 409
            bookings.remove(activity)
            message = f"Has cancelado tu reserva para {activity.name}"
            
        db.session.commit()
        return jsonify({"message": message})

    @app.route('/api/turnos/<int:turno_id>/book', methods=['POST'])
    @login_required
    def book_turno(turno_id):
        return handle_booking('book', 'turno', turno_id)

    @app.route('/api/turnos/<int:turno_id>/cancel', methods=['POST'])
    @login_required
    def cancel_turno(turno_id):
        return handle_booking('cancel', 'turno', turno_id)

    @app.route('/api/clases/<int:clase_id>/book', methods=['POST'])
    @login_required
    def book_clase(clase_id):
        return handle_booking('book', 'clase', clase_id)

    @app.route('/api/clases/<int:clase_id>/cancel', methods=['POST'])
    @login_required
    def cancel_clase(clase_id):
        return handle_booking('cancel', 'clase', clase_id)
        
    @app.route('/api/user/membership', methods=['POST'])
    @login_required
    def change_membership():
        data = request.get_json()
        new_type = data.get('member_type')
        if not new_type or new_type not in ['clasica', 'black', 'soloclases']:
            return jsonify({"message": "Tipo de membresía inválido"}), 400
        
        user = User.query.get(session['user_id'])
        if user.member_type == new_type:
            return jsonify({"message": f"Ya tienes la membresía {new_type}"}), 400
        
        user.member_type = new_type
        db.session.commit()
        session['member_type'] = new_type
        
        updated_user = {"id": user.id, "email": user.email, "member_type": user.member_type}
        return jsonify({"message": f"¡Felicidades! Tu membresía es ahora {new_type}.", "user": updated_user})
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)