# github_auth.py
import os
import requests
from flask import Flask, request, redirect, jsonify
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:5000/callback")

app = Flask(__name__)

@app.route("/login")
def login():
    """Redirect user to GitHub for authorization."""
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=repo"
    )
    return redirect(github_auth_url)

@app.route("/callback")
def callback():
    """GitHub redirects here with the authorization code."""
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "No code received"}), 400

    # Exchange code for access token
    token_url = "https://github.com/login/oauth/access_token"
    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI
    }
    headers = {"Accept": "application/json"}

    response = requests.post(token_url, data=payload, headers=headers)
    token_json = response.json()

    access_token = token_json.get("access_token")
    if not access_token:
        return jsonify({"error": "Failed to obtain access token", "details": token_json}), 400

    # Store or return the access token
    return jsonify({
        "message": "Authentication successful!",
        "access_token": access_token
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
