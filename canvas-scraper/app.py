# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from canvas_scraper import login_and_get_courses

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/scrape-canvas', methods=['POST'])
def scrape_canvas():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"success": False, "error": "Missing username or password."})

        courses = login_and_get_courses(username, password)
        return jsonify({"success": True, "courses": courses})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(port=8000)
