from flask import Flask, request, render_template, jsonify
from PyPDF2 import PdfReader
import re
import pickle
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash


app = Flask(__name__)
CORS(app)

# Database connection URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://testdatabase_5wud_user:20bCBu7dXR8FQc6FWNUQ3ZQE9tRUCt55@dpg-cr23a9ggph6c73bf5hsg-a.oregon-postgres.render.com/testdatabase_5wud'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


hashed_password = generate_password_hash("admin")
print( "THIS IS ADMIN PASSWORD"+hashed_password)

db = SQLAlchemy(app)

# Example: Define a simple model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=True)


# New route to display users
@app.route("/users")
def users():
    all_users = User.query.all()
    return render_template('resume.html', users=all_users)

# Load models===========================================================================================================
rf_classifier_categorization = pickle.load(open('models/rf_classifier_categorization.pkl', 'rb'))
tfidf_vectorizer_categorization = pickle.load(open('models/tfidf_vectorizer_categorization.pkl', 'rb'))
rf_classifier_job_recommendation = pickle.load(open('models/rf_classifier_job_recommendation.pkl', 'rb'))
tfidf_vectorizer_job_recommendation = pickle.load(open('models/tfidf_vectorizer_job_recommendation.pkl', 'rb'))

# Clean resume==========================================================================================================
def cleanResume(txt):
    cleanText = re.sub(r'http\S+\s', ' ', txt)
    cleanText = re.sub(r'RT|cc', ' ', cleanText)
    cleanText = re.sub(r'#\S+\s', ' ', cleanText)
    cleanText = re.sub(r'@\S+', '  ', cleanText)
    cleanText = re.sub(r'[%s]' % re.escape(r"""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', cleanText)
    cleanText = re.sub(r'[^\x00-\x7f]', ' ', cleanText)
    cleanText = re.sub(r'\s+', ' ', cleanText)
    return cleanText

# Prediction and Category Name
def predict_category(resume_text):
    resume_text = cleanResume(resume_text)
    resume_tfidf = tfidf_vectorizer_categorization.transform([resume_text])
    predicted_category = rf_classifier_categorization.predict(resume_tfidf)[0]
    return predicted_category

# Prediction and Category Name
def job_recommendation(resume_text):
    resume_text= cleanResume(resume_text)
    resume_tfidf = tfidf_vectorizer_job_recommendation.transform([resume_text])
    recommended_job = rf_classifier_job_recommendation.predict(resume_tfidf)[0]
    return recommended_job

def pdf_to_text(file):
    reader = PdfReader(file)
    text = ''
    for page in range(len(reader.pages)):
        text += reader.pages[page].extract_text()
    return text

@app.route("/")
def resume():
    return render_template('resume.html')

@app.route('/pred', methods=['POST'])
def pred():
    if 'resume' in request.files:
        file = request.files['resume']
        filename = file.filename

        if filename.endswith('.pdf'):
            text = pdf_to_text(file)
        elif filename.endswith('.txt'):
            text = file.read().decode('utf-8')
        else:
            return jsonify({'message': "Invalid file format. Please upload a PDF or TXT file."})

        predicted_category = predict_category(text)
        recommended_job = job_recommendation(text)

        return jsonify({
            'predicted_category': predicted_category,
            'recommended_job': recommended_job,
            'message': ''
        })
    else:
        return jsonify({'message': "No resume file uploaded."})
    
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not username or not email or not password:
        return jsonify({"error": "Please fill out all required fields."}), 400

    # Use default PBKDF2 hashing
    hashed_password = generate_password_hash(password)

    # Create a new user object
    new_user = User(username=username, email=email, password=hashed_password, role=role)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    identifier = data.get('identifier')  # This can be either username or email
    password = data.get('password')
    role = data.get('role')

    # Admin login logic
    if identifier == "admin":
        user = User.query.filter_by(username="admin").first()
        if user and check_password_hash(user.password, password):
            return jsonify({"message": "Login successful!", "redirect": "/admin-home"}), 200
        else:
            return jsonify({"error": "Invalid admin credentials."}), 401

    if not identifier or not password or not role:
        return jsonify({"error": "Please fill out all required fields."}), 400

    # Query the database for a user matching the provided username or email
    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

    if user and check_password_hash(user.password, password) and user.role == role:
        if role == "Job Seeker":
            return jsonify({"message": "Login successful!", "redirect": "/seeker-home"}), 200
        elif role == "Job Provider":
            return jsonify({"message": "Login successful!", "redirect": "/provider-home"}), 200
        else:
            return jsonify({"error": "Invalid role selected."}), 403
    else:
        return jsonify({"error": "Invalid credentials."}), 401

if __name__ == "__main__":
    app.run(debug=True)
