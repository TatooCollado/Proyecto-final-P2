from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

user_turnos = db.Table('user_turnos',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('turno_id', db.Integer, db.ForeignKey('turno.id'), primary_key=True)
)

user_clases = db.Table('user_clases',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('clase_id', db.Integer, db.ForeignKey('clase.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    lastname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    birth_date = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    member_type = db.Column(db.String(50), nullable=False, default='clasica')
    
    booked_turnos = db.relationship('Turno', secondary=user_turnos, backref=db.backref('users', lazy=True))
    booked_clases = db.relationship('Clase', secondary=user_clases, backref=db.backref('users', lazy=True))

class Turno(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    time = db.Column(db.String(100), nullable=False)

class Clase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    instructor = db.Column(db.String(100), nullable=False)