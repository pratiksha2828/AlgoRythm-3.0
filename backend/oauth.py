import requests
import time

import os

CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")


DEVICE_CODE_URL = "https://github.com/login/device/code"
TOKEN_URL = "https://github.com/login/oauth/access_token"

def fetch_repositories(token):
    """Fetch repositories for the authenticated user."""
    headers = {"Authorization": f"token {token}"}
    url = "https://api.github.com/user/repos?per_page=100"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise RuntimeError(f"Failed to fetch repos: {response.json()}")

    repos = response.json()
    repo_list = [repo["full_name"] for repo in repos]
    return repo_list
def authenticate():
    # Step 1: Ask GitHub for a device + user code
    response = requests.post(
        DEVICE_CODE_URL,
        headers={"Accept": "application/json"},
        data={
            "client_id": CLIENT_ID,
            "scope": "repo user"  # adjust scopes if needed
        }
    ).json()

    if "user_code" not in response:
        raise RuntimeError(f"GitHub did not return a user_code. Full response: {response}")

    device_code = response["device_code"]
    user_code = response["user_code"]
    verification_uri = response["verification_uri"]
    interval = response.get("interval", 5)

    print(f"\n🔑 Go to {verification_uri} and enter this code: {user_code}\n")

    # Step 2: Poll GitHub until the user approves
    while True:
        token_response = requests.post(
            TOKEN_URL,
            headers={"Accept": "application/json"},
            data={
                "client_id": CLIENT_ID,
                "device_code": device_code,
                "grant_type": "urn:ietf:params:oauth:grant-type:device_code"
            }
        ).json()

        if "access_token" in token_response:
            print("✅ Authentication successful!")
            return token_response["access_token"]

        if token_response.get("error") == "authorization_pending":
            time.sleep(interval)
            continue
        else:
            raise RuntimeError(f"OAuth failed: {token_response}")
