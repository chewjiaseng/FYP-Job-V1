from flask import Flask, request, render_template, jsonify
from PyPDF2 import PdfReader
import re
import pickle
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from flask_session import Session
import os
import time
import logging
from werkzeug.utils import secure_filename
import redis
from dotenv import load_dotenv
import base64
from sqlalchemy import text
from cryptography.fernet import Fernet
from cryptography.fernet import InvalidToken
import fitz
import pytesseract
from PIL import Image
import io

# Specify the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Adjust this if your installation is different


# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
# allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:8080').split(',')

load_dotenv()
environment = os.getenv('FLASK_ENV', 'development')


# CORS Configuration
# CORS(app, origins=["http://localhost:8080"], supports_credentials=True)
# CORS(app, supports_credentials=True, origins='*')
frontend_url = os.getenv('FRONTEND_URL', 'https://job-frontend-hxx1.onrender.com')
local_frontend_urls = ['http://localhost:8080', 'http://192.168.0.105:8080','http://192.168.0.104:8080']

CORS(app, supports_credentials=True, origins=[frontend_url] + local_frontend_urls)

# Secret key for sessions (use environment variables in production)
app.secret_key = 'f333afb8a7da4ca70cf6db9c57bdc742'

# Flask-Session Configuration
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_FILE_DIR'] = os.path.join(app.root_path, 'flask_session')
app.config['SESSION_PERMANENT'] = False  # Optional: session expiration

app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url("rediss://red-crl9vqogph6c73e28qdg:tr0CPEn877CR8b5KQdjHDASLwKDv9L8F@oregon-redis.render.com:6379")

# Example: Set other environment-specific configurations
if environment == 'production':
    app.config['SESSION_COOKIE_SECURE'] = True
else:
    app.config['SESSION_COOKIE_SECURE'] = False

app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True  # Use this if you're on HTTPS

os.makedirs(app.config['SESSION_FILE_DIR'], exist_ok=True)
Session(app)

# Define the path to the session folder
# session_folder = 'D:/UPM registration/fyp local path github/FYP-Job-V1/backend flask/flask_session'
now = time.time()

# Delete session files older than 6 hours (21,600 seconds)
# for filename in os.listdir(session_folder):
#     file_path = os.path.join(session_folder, filename)
#     if os.path.getmtime(file_path) < now - 21600:  # 6 hours = 21600 seconds
#         os.remove(file_path)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = '/login'  # Redirect to login if not authenticated

# Database connection external URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://test2database2_user:Q5bjzhcPfYJR4KUuolAy6YfXyd6Qtfj0@dpg-crjqh65ds78s73ed1ns0-a.oregon-postgres.render.com/test2database2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

env_file = '.env.' + os.getenv('FLASK_ENV', 'development')

# Explicitly load the environment variables from the correct .env file
load_dotenv(dotenv_path=env_file)

fernet_key = os.getenv('FERNET_KEY')
if not fernet_key:
    raise ValueError("FERNET_KEY is not set in the environment variables")

cipher_suite = Fernet(fernet_key.encode())

# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), nullable=True)

    # Required for Flask-Login
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        # Assuming all users are active by default
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

# User Loader
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Example: Define a simple model
# (Assuming you have a Job model defined elsewhere)
class Job(db.Model):
    __tablename__ = 'jobs'  # Correct table name
    id = db.Column(db.Integer, primary_key=True)
    job_name = db.Column(db.String(100), nullable=False)
    job_provider_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    job_category = db.Column(db.String(100), nullable=False)
    salary = db.Column(db.String(255), nullable=False)
    working_place = db.Column(db.String(100), nullable=False)
    working_hours = db.Column(db.String(50), nullable=False)
    job_description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False)  # Make sure to match your column type
    provider_name = db.Column(db.String(255), nullable=False)

class Application(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    job_seeker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    identification_card = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    hp_number = db.Column(db.String(15), nullable=False)
    resume_pdf = db.Column(db.LargeBinary, nullable=True)
    applied_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pending')
    job = db.relationship('Job', backref='applications', lazy=True)

# Load models for prediction
rf_classifier_categorization = pickle.load(open('models/rf_classifier_categorization.pkl', 'rb'))
tfidf_vectorizer_categorization = pickle.load(open('models/tfidf_vectorizer_categorization.pkl', 'rb'))
rf_classifier_job_recommendation = pickle.load(open('models/rf_classifier_job_recommendation.pkl', 'rb'))
tfidf_vectorizer_job_recommendation = pickle.load(open('models/tfidf_vectorizer_job_recommendation.pkl', 'rb'))

# Clean resume function
def cleanResume(txt):
    cleanText = re.sub(r'http\S+\s', ' ', txt)
    cleanText = re.sub(r'RT|cc', ' ', cleanText)
    cleanText = re.sub(r'#\S+\s', ' ', cleanText)
    cleanText = re.sub(r'@\S+', '  ', cleanText)
    cleanText = re.sub(r'[%s]' % re.escape(r"""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', cleanText)
    cleanText = re.sub(r'[^\x00-\x7f]', ' ', cleanText)
    cleanText = re.sub(r'\s+', ' ', cleanText)
    return cleanText

# Prediction functions
def predict_category(resume_text):
    resume_text = cleanResume(resume_text)
    resume_tfidf = tfidf_vectorizer_categorization.transform([resume_text])
    predicted_category = rf_classifier_categorization.predict(resume_tfidf)[0]
    return predicted_category

def job_recommendation(resume_text):
    resume_text = cleanResume(resume_text)
    resume_tfidf = tfidf_vectorizer_job_recommendation.transform([resume_text])
    recommended_job = rf_classifier_job_recommendation.predict(resume_tfidf)[0]
    return recommended_job

def pdf_to_text(file):
    pdf_bytes = file.read()
    pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
    
    text = ""
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        # Try extracting blocks of text
        blocks = page.get_text("blocks")
        for block in blocks:
            text += block[4] + "\n"  # Block's text content
    
    pdf_document.close()

    if not text.strip():
        return None  # Return None if no text is extracted
    return text

#To validate whether it is resume or not
def is_valid_resume(text):
    # List of common resume keywords
    resume_keywords = ['experience', 'skills', 'education', 'contact', 'languages', 
                       'name', 'projects', 'references', 'technical skill', 
                       'soft skill', 'communication']

    # Convert the text to lowercase for case-insensitive matching
    text_lower = text.lower()

    # Count the number of matching keywords in the text
    matched_keywords = [keyword for keyword in resume_keywords if keyword in text_lower]
    
    # Define a threshold for validation (e.g., 3 or more keywords must be present)
    return len(matched_keywords) >= 3

#To check the resume if save in canva
def extract_images_from_pdf(file):
    pdf_bytes = file.read()
    pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
    full_text = ""

    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        image_list = page.get_images(full=True)

        if image_list:
            print(f"Page {page_num} contains {len(image_list)} images")
            for image_index, img in enumerate(image_list, start=1):
                xref = img[0]
                base_image = pdf_document.extract_image(xref)
                image_bytes = base_image["image"]

                # Use OCR to extract text from the image without saving to file
                image = Image.open(io.BytesIO(image_bytes))
                extracted_text = pytesseract.image_to_string(image)
                full_text += extracted_text + "\n"  # Accumulate text from all images

        else:
            print(f"No images found on page {page_num}")

    pdf_document.close()
    
    # Return the accumulated text or None if empty
    cleaned_text = full_text.strip()
    return cleaned_text

# Routes
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
            return jsonify({'message': "Invalid file format. Please upload a PDF or TXT file."}), 400

        predicted_category = predict_category(text)
        recommended_job = job_recommendation(text)

        return jsonify({
            'predicted_category': predicted_category,
            'recommended_job': recommended_job,
            'message': ''
        }), 200
    else:
        return jsonify({'message': "No resume file uploaded."}), 400

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not username or not email or not password:
        return jsonify({"error": "Please fill out all required fields."}), 400

    # Encrypt the password
    encrypted_password = cipher_suite.encrypt(password.encode()).decode()

    # Create a new user object
    new_user = User(username=username, email=email, password=encrypted_password, role=role)

    try:
        db.session.add(new_user)
        db.session.commit()
        app.logger.info(f"User {username} created successfully.")
        return jsonify({"success": True, "message": "User created successfully!"}), 201

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error occurred during signup: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    identifier = data.get('identifier')  # This can be either username or email
    password = data.get('password')
    role = data.get('role')

    if not identifier or not password:
        app.logger.warning("Missing identifier or password.")
        return jsonify({"error": "Please provide both identifier and password."}), 400

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

    if user:
        # Admin logic: Hardcoded check for admin credentials
        if identifier == 'admin' and password == 'admin':
            login_user(user)
            app.logger.info(f"Admin user {user.username} logged in successfully.")
            return jsonify({
                "message": "Login successful!",
                "redirect": '/admin-home',
                "username": user.username,
                "role": user.role
            }), 200
        
        # Decrypt the password for regular users
        decrypted_password = cipher_suite.decrypt(user.password.encode()).decode()

        # Check if decrypted password matches the provided password
        if password == decrypted_password:
            # Check if role matches
            if user.role == role:
                login_user(user)
                app.logger.info(f"User {user.username} logged in successfully.")
                redirect_url = '/seeker-home' if user.role == 'Job Seeker' else '/provider-home'
                return jsonify({
                    "message": "Login successful!",
                    "redirect": redirect_url,
                    "username": user.username,
                    "role": user.role
                }), 200
            else:
                app.logger.warning(f"Role mismatch for user: {identifier}")
                return jsonify({"error": "Invalid role."}), 401
        else:
            app.logger.warning(f"Incorrect password for user: {identifier}")
            return jsonify({"error": "Invalid credentials."}), 401
    else:
        app.logger.warning(f"Failed login attempt for identifier: {identifier}")
        return jsonify({"error": "Invalid credentials."}), 401

@app.route('/user-info', methods=['GET'])
@login_required
def user_info():
    if current_user.is_authenticated:
        return jsonify({"username": current_user.username, "role": current_user.role, "user_id": current_user.id }), 200
    else:
        return jsonify({"error": "User not authenticated."}), 401

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    app.logger.info(f"User logged out successfully.")
    return jsonify({"message": "Logged out successfully!"}), 200

# Route to handle job creation by job providers
@app.route('/create-job', methods=['POST'])
@login_required
def create_job():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.json
    job_name = data.get('job_name')
    job_category = data.get('job_category')
    salary = data.get('salary')
    working_place = data.get('working_place')
    working_hours = data.get('working_hours')
    job_description = data.get('job_description')

    if not all([job_name, job_category, salary, working_place, working_hours, job_description]):
        return jsonify({"error": "Missing fields in request data"}), 400

    job_provider_id = current_user.id
    provider_name = current_user.username  # Get the username of the current user

    new_job = Job(
        job_name=job_name,
        job_provider_id=job_provider_id,
        provider_name=provider_name,
        job_category=job_category,
        salary=salary,
        working_place=working_place,
        working_hours=working_hours,
        job_description=job_description
    )

    try:
        db.session.add(new_job)
        db.session.commit()
        return jsonify({"message": "Job created successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error occurred during job creation: " + str(e)}), 500
    
@app.route('/provider-jobs', methods=['GET'])
@login_required
def provider_jobs():
    user_id = current_user.id
    jobs = Job.query.filter_by(job_provider_id=user_id).all()
    
    # Convert jobs to a list of dictionaries
    jobs_list = [{
        'id': job.id,
        'job_name': job.job_name,
        'job_category': job.job_category,
        'salary': job.salary,
        'working_place': job.working_place,
        'working_hours': job.working_hours,
        'job_description': job.job_description,
        'created_at': job.created_at
    } for job in jobs]
    
    return jsonify(jobs_list), 200

@app.route("/users", methods=['GET'])
def users():
    all_users = User.query.all()
    users_data = []
    for user in all_users:
        try:
            # Try to decrypt the password if it was encrypted with Fernet
            decrypted_password = cipher_suite.decrypt(user.password.encode()).decode() if user.password else None
        except InvalidToken:
            # If the password is not a valid Fernet token, skip decryption or handle accordingly
            decrypted_password = user.password  # Optionally show 'Invalid' or 'Unencrypted' status

        users_data.append({
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "password": decrypted_password
        })
    
    return jsonify(users_data), 200

# Updating job details for Job provide
@app.route('/update-job/<int:job_id>', methods=['PUT'])
@login_required
def update_job(job_id):
    # Check if the current user is admin
    if current_user.username == "admin":
        job = Job.query.filter_by(id=job_id).first()  # Admin can access any job without filtering by job_provider_id
    else:
        # For regular users (job providers), only allow access to their own jobs
        job = Job.query.filter_by(id=job_id, job_provider_id=current_user.id).first()

    if not job:
        return jsonify({"error": "Job not found or you're not authorized to update this job."}), 404
    
    data = request.json
    
    job.job_name = data.get('job_name', job.job_name)
    job.job_category = data.get('job_category', job.job_category)
    job.salary = data.get('salary', job.salary)
    job.working_place = data.get('working_place', job.working_place)
    job.working_hours = data.get('working_hours', job.working_hours)
    job.job_description = data.get('job_description', job.job_description)
    
    try:
        db.session.commit()
        return jsonify({"message": "Job updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error occurred during job update: " + str(e)}), 500

# To delete job for Job providers
@app.route('/delete-job/<int:job_id>', methods=['DELETE'])
@login_required
def delete_job(job_id):
    
    # Check if the current user is admin
    if current_user.username == "admin":
        job = Job.query.filter_by(id=job_id).first()  # Admin can delete any job without filtering by job_provider_id
    else:
        # For regular users (job providers), only allow access to their own jobs
        job = Job.query.filter_by(id=job_id, job_provider_id=current_user.id).first()

    if not job:
        return jsonify({"error": "Job not found or you're not authorized to delete this job."}), 404
    
    try:
        db.session.delete(job)
        db.session.commit()
        return jsonify({"message": "Job deleted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error occurred during job deletion: " + str(e)}), 500
    
#get all the jobs to seeker
@app.route('/getjobs', methods=['GET'])
@login_required
def get_all_jobs():
    jobs = Job.query.all()
    
    jobs_list = [{
        'id': job.id,
        'job_name': job.job_name,
        'job_category': job.job_category,
        'salary': job.salary,
        'working_place': job.working_place,
        'working_hours': job.working_hours,
        'job_description': job.job_description,
        'created_at': job.created_at,
        'provider_name': job.provider_name
    } for job in jobs]
    
    return jsonify(jobs_list), 200

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#Apply job
@app.route('/apply', methods=['POST'])
@login_required
def apply():
    resume_pdf_content = None
    
    # Check if a file is uploaded
    if 'resume_pdf' in request.files:
        resume_pdf = request.files['resume_pdf']
        if resume_pdf and allowed_file(resume_pdf.filename):
            filename = secure_filename(resume_pdf.filename)
            resume_pdf_content = resume_pdf.read()

    data = {
        'job_id': request.form.get('job_id'),
        'name': request.form.get('name'),
        'identification_card': request.form.get('identification_card'),
        'gender': request.form.get('gender'),
        'hp_number': request.form.get('hp_number'),
    }

    if not all(data.values()):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    # Create the application object with optional resume_pdf_content
    application = Application(
        job_id=data['job_id'],
        job_seeker_id=current_user.id,
        name=data['name'],
        identification_card=data['identification_card'],
        gender=data['gender'],
        hp_number=data['hp_number'],
        resume_pdf=resume_pdf_content  # Can be None if no PDF is uploaded
    )

    try:
        db.session.add(application)
        db.session.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'success': False, 'message': 'Failed to apply'}), 500

#For recommendation show the recommend jobs, retrieve the jobs based on predicted category
from sqlalchemy import func    
@app.route('/jobs', methods=['POST'])
@login_required
def fetch_jobs():
    if 'resume' not in request.files:
        return jsonify({"message": "No resume file provided."}), 400
    
    resume = request.files['resume']
    
    # Check if the file is a PDF or a text file
    if resume.filename.endswith('.pdf'):
        resume_text = pdf_to_text(resume)
        
        # If no text found in PDF, try extracting from images
        if resume_text is None:
            print("No text found in PDF, attempting to extract images from the PDF.")
            resume.seek(0)  # Reset file pointer to the start
            resume_text = extract_images_from_pdf(resume)

    else:
        resume_text = resume.read().decode('utf-8')

    # print("Extracted Text:", resume_text)  # Log the extracted text for debugging

    # Validate if the text is likely a resume
    # Check if resume_text is still None
    if resume_text is None or resume_text.strip() == "":
        return jsonify({"message": "The uploaded file does not contain valid resume text."}), 400

    # Perform the resume validation on the extracted text
    if not is_valid_resume(resume_text):
        return jsonify({"message": "The uploaded file does not appear to be a valid resume."}), 400

    # Predict the category and recommend a job based on resume content
    predicted_category = predict_category(resume_text)
    recommended_job = job_recommendation(resume_text)

    print(f"Predicted Category: {predicted_category}")  # Debugging log
    
    # Fetch jobs based on the predicted category
    jobs = Job.query.filter(func.lower(Job.job_category) == func.lower(predicted_category)).all()
    #jobs = Job.query.filter(func.lower(Job.job_category) == func.lower(predicted_category.lower())).all()

    
    jobs_list = [{
        'id': job.id,
        'job_name': job.job_name,
        'job_category': job.job_category,
        'salary': job.salary,
        'working_place': job.working_place,
        'working_hours': job.working_hours,
        'job_description': job.job_description,
        'created_at': job.created_at,
        'provider_name': job.provider_name
    } for job in jobs]
    
    # Return the predicted category and recommended job, even if no jobs are found
    response_data = {
        "predicted_category": predicted_category,
        "recommended_job": recommended_job,
        "jobs": jobs_list,
    }

    if not jobs_list:  # No jobs found for the predicted category
        response_data["message"] = f"Sorry, currently we don't have jobs in the '{predicted_category}' category."

    return jsonify(response_data), 200

#For the Job provider to view the applications based on their own jobs 

@app.route('/provider-applications', methods=['GET'])
def get_provider_applications():
    try:
        if not current_user.is_authenticated:
            return jsonify({"error": "User not authenticated."}), 401

        provider_id = current_user.id

        query = text("""
        SELECT 
            a.id AS application_id,
            a.name AS applicant_name,
            a.identification_card,
            a.gender,
            a.hp_number,
            a.status,
            a.applied_at,
            j.job_name,
            j.job_category,
            j.working_place,
            u.username AS job_provider_name,
            a.resume_pdf
        FROM 
            applications a
        JOIN 
            jobs j ON a.job_id = j.id
        JOIN 
            "user" u ON j.job_provider_id = u.id
        WHERE 
            u.id = :provider_id;
        """)

        result = db.session.execute(query, {'provider_id': provider_id})

        applications = result.mappings().all()

        response = []
        for row in applications:
            row_dict = dict(row)
            # Encode resume_pdf as base64 if it exists
            if row.resume_pdf:
                row_dict['resume_pdf'] = base64.b64encode(row.resume_pdf).decode('utf-8')
            response.append(row_dict)

        return jsonify(response)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/application/<int:application_id>/status', methods=['PUT'])
def update_application_status(application_id):
    try:
        if not current_user.is_authenticated:
            return jsonify({"error": "User not authenticated."}), 401

        # Get new status from the request
        new_status = request.json.get('status')
        if new_status not in ['Pending', 'Received']:
            return jsonify({"error": "Invalid status."}), 400

        # Fetch the application using db.session.get (this is the recommended method for SQLAlchemy 2.x)
        application = db.session.get(Application, application_id)
        if not application:
            return jsonify({"error": "Application not found."}), 404

        # Update the status of the application
        application.status = new_status

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Status updated successfully."})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

#For admin update and delete
@app.route('/update-user/<username>', methods=['PUT'])
def update_user(username):
    user_data = request.get_json()
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Update fields
    user.email = user_data.get('email', user.email)

    # Encrypt the password if it's being updated
    if user_data.get('password'):
        user.password = cipher_suite.encrypt(user_data['password'].encode()).decode()

    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200

@app.route('/delete-user/<username>', methods=['DELETE'])
def delete_user(username):
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

# Route to retrieve all applications (no provider filter)
@app.route('/all-applications', methods=['GET'])
def get_all_applications():
    try:
        query = text("""
        SELECT 
            a.id AS application_id,
            a.name AS applicant_name,
            a.identification_card,
            a.gender,
            a.hp_number,
            a.status,
            a.applied_at,
            j.job_name,
            j.job_category,
            j.working_place,
            u.username AS job_provider_name,
            a.resume_pdf
        FROM 
            applications a
        JOIN 
            jobs j ON a.job_id = j.id
        JOIN 
            "user" u ON j.job_provider_id = u.id;
        """)

        result = db.session.execute(query)

        applications = result.mappings().all()

        response = []
        for row in applications:
            row_dict = dict(row)
            # Encode resume_pdf as base64 if it exists
            if row.resume_pdf:
                row_dict['resume_pdf'] = base64.b64encode(row.resume_pdf).decode('utf-8')
            response.append(row_dict)

        return jsonify(response)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/update-application/<int:application_id>', methods=['PUT'])
def update_application(application_id):
    application = Application.query.get(application_id)
    
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    try:
        # Update the application fields
        application.name = request.form.get('name', application.name)
        application.identification_card = request.form.get('identification_card', application.identification_card)
        application.gender = request.form.get('gender', application.gender)
        application.hp_number = request.form.get('hp_number', application.hp_number)
        application.status = request.form.get('status', application.status)

        # Check for remove_resume flag
        if request.form.get('remove_resume') == 'true':
            application.resume_pdf = None  # Set to None to remove the current resume

        # Handle resume file upload after checking for removal
        if 'resume_pdf' in request.files:
            resume_pdf = request.files['resume_pdf']
            if resume_pdf and allowed_file(resume_pdf.filename):
                filename = secure_filename(resume_pdf.filename)
                application.resume_pdf = resume_pdf.read()  # Update the resume_pdf content

        db.session.commit()
        return jsonify({'message': 'Application updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    
@app.route('/delete-application/<int:application_id>', methods=['DELETE'])
def delete_application(application_id):
    application = Application.query.get(application_id)
    
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    try:
        db.session.delete(application)
        db.session.commit()
        return jsonify({'message': 'Application deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
   

if __name__ == "__main__":
    # Ensure the session directory exists
    os.makedirs(app.config['SESSION_FILE_DIR'], exist_ok=True)
    app.run(debug=True)
