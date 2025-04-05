# canvas_scraper.py

from playwright.sync_api import sync_playwright
import time
import os
import json

COOKIES_PATH = "canvas_cookies.json"

def login_with_credentials(username, password):
    with sync_playwright() as p:
        # Launch in headless mode for automated login.
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        page.goto("https://canvas.asu.edu")

        # Click on "ASU Login" (update the selector if necessary)
        page.click("text=ASU Login")

        # Fill in the login form with provided credentials.
        page.fill('input[name="username"]', username)
        page.fill('input[name="password"]', password)
        page.click('button[type="submit"]')

        # Wait for the URL to change to indicate successful login.
        page.wait_for_url("https://canvas.asu.edu/", timeout=60000)

        # Save cookies for future headless scraping.
        cookies = page.context.cookies()
        with open(COOKIES_PATH, "w") as f:
            json.dump(cookies, f)
        print("✅ Login successful via headless mode; cookies saved.")
        browser.close()

def scrape_classes_with_saved_cookies():
    if not os.path.exists(COOKIES_PATH):
        raise Exception("You must log in first to get cookies.")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Load cookies from file.
        with open(COOKIES_PATH, "r") as f:
            cookies = json.load(f)
            context.add_cookies(cookies)

        page = context.new_page()
        page.goto("https://canvas.asu.edu/courses")

        # Wait for the courses page to load.
        try:
            page.wait_for_selector(".ic-DashboardCard__header-title", timeout=30000)
        except Exception as e:
            print("Warning: Could not find expected elements, proceeding anyway.")

        # Print the entire page content to the console for verification.
        content = page.inner_text("body")
        print("----- Page Content Start -----")
        print(content)
        print("----- Page Content End -----")

        # Return dummy class data (or later, real scraped data).
        classes = [{"name": "Dummy Class", "id": "12345"}]
        browser.close()
        return classes
