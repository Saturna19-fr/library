from flask import Flask, request, render_template, redirect, url_for, session,  jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("DATABASE_CONNECTION_STRING")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    isbn = db.Column(db.String(80), unique=True, nullable=False)
    count = db.Column(db.Integer, unique=False, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

@app.route("/")
def index():
    return render_template("index.html", apikey = environ.get("ISBN_DB_API_KEY"), baseurl = environ.get("ISBN_DB_ENDPOINT"))


@app.route("/api/addbook", methods=["POST"])
def addbook():
    try:

        headers = request.headers
        book = Book(name=headers.get('Title'), isbn=headers.get('ISBN'), count=1)
        db.session.add(book)
        db.session.commit()
        return jsonify({"status": 200, "message": "Book added successfully", "id": book.id})
    except Exception as e:
        return jsonify({"status": 500, "message": f"Internal Server Error {e}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=443, debug=True, load_dotenv=True, use_reloader=True, ssl_context = ('.local/cert1.pem', '.local/privkey1.pem'))