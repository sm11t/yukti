# app.py

from flask import Flask, request, jsonify
from canvas_scraper import login_with_credentials, scrape_classes_with_saved_cookies

app = Flask(__name__)

@app.route('/scrape-canvas', methods=['POST'])
def sync_and_scrape():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        # Log in to Canvas using provided credentials (in headless mode)
        login_with_credentials(username, password)
        # Scrape the courses page in headless mode and print page content to console.
        classes = scrape_classes_with_saved_cookies()
        return jsonify({"success": True, "classes": classes})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(port=8000)
