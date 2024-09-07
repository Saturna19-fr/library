from flask import Flask, request, render_template, redirect, url_for, session,  jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ
from auth.auth import auth_bp
from dotenv import load_dotenv
import requests
from sqlalchemy.exc import IntegrityError
load_dotenv()
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("DATABASE_CONNECTION_STRING")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["environnement"] = environ.get("TYPE_OF_ENV") or "PRODUCTION"

app.register_blueprint(auth_bp)

db = SQLAlchemy(app)

def getDataByISBN(isbn)->dict:
    d = requests.get(url=f"https://api2.isbndb.com/book/{isbn}", headers={"Authorization": environ.get("ISBN_DB_API_KEY")})
    if d.status_code != 200:
        return {"error": 404, "message": d.json()["errorMessage"]}
    return d.json()

        
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    isbn = db.Column(db.String(80), unique=True, nullable=False)
    count = db.Column(db.Integer, unique=False, nullable=False)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/addbook", methods=["POST"])
def addbook():
    bookData = None
    try:
        bookData = getDataByISBN(request.headers.get('ISBN'))
        if "error" in bookData:
            return jsonify({"status": 404, "message": bookData["message"]})
    except Exception as e:
        return jsonify({"status": 500, "message": f"An error occured !\n {e}"})
        #END
    else:
        #Continue
        print("Données récupérées.")
    
    try:
        book = Book(name = bookData["book"]["title"], isbn = request.headers.get("ISBN"), count = 1)
        db.session.add(book)
        db.session.commit()
        return jsonify({"status": 201, "message": "Book added successfully", "id": book.id})
    except IntegrityError as e:
        return jsonify({"status": 409, "message": "Book already exists"})
        #END
    except Exception as e:
        return jsonify({"status": 500, "message": f"Internal Server Error {e}"})
        #END
        

# @app.route("/api/addbook", methods=["POST"])
# def addbook():
#     bookData = None
#     try:
#         bookData = getDataByISBN(request.headers.get('ISBN'))
#     except Exception as e:
#         return jsonify({"status": 500, "message": f"An error occured !\n {e}"})
#     try:
#         headers = request.headers
#         book = Book(name=headers.get('Title'), isbn=headers.get('ISBN'), count=1)
#         db.session.add(book)
#         db.session.commit()
#         return jsonify({"status": 200, "message": "Book added successfully", "id": book.id})
#     except Exception as e:
#         return jsonify({"status": 500, "message": f"Internal Server Error {e}"})

if __name__ == "__main__":
    if app.config["environnement"] == "DEV":
        app.run(host="0.0.0.0", port=443, debug=True, load_dotenv=True, use_reloader=True, ssl_context = ('.local/cert1.pem', '.local/privkey1.pem'))
    elif app.config["environnement"] == "PRODUCTION":
        app.run(host="0.0.0.0", port=5000, load_dotenv=True)
    else:
        print("Une erreur s'est produite", "\nVous devez spécifier un environnement de travail")