from app import app, db

# Use the application context
with app.app_context():
    db.create_all()
    print("Database tables created.")
