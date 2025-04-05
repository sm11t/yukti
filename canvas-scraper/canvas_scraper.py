# canvas_scraper.py

from playwright.sync_api import sync_playwright, TimeoutError
import time

def login_and_get_courses(username, password):
    """
    Logs into Canvas in non-headless mode, waits 20 seconds for DUO verification,
    clicks the courses button, scrapes the list of courses, prints them, and returns the list.
    """
    with sync_playwright() as p:
        # Launch in non-headless mode for debugging.
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        print("Navigating to Canvas ASU...")
        page.goto("https://canvas.asu.edu")

        # Wait for login form fields.
        page.wait_for_selector('input[name="username"]', timeout=30000)
        page.wait_for_selector('input[name="password"]', timeout=30000)

        print("Filling in credentials...")
        page.fill('input[name="username"]', username)
        page.fill('input[name="password"]', password)

        print("Pressing ENTER to submit the form...")
        page.press('input[name="password"]', 'Enter')

        # Wait 20 seconds to allow DUO verification on the user's mobile.
        print("Waiting 20 seconds for DUO verification...")
        time.sleep(20)

        # Wait for the courses button to appear.
        try:
            page.wait_for_selector('#global_nav_courses_link', timeout=60000)
            print("Login successful! Courses button detected.")
        except TimeoutError:
            page.screenshot(path="login_failed.png")
            browser.close()
            raise Exception("Login failed or took too long.")

        print("Clicking the Courses button...")
        page.click('#global_nav_courses_link')

        # Wait for the courses side panel to appear.
        try:
            page.wait_for_selector('a[href^="/courses/"]', timeout=30000)
        except TimeoutError:
            browser.close()
            raise Exception("Courses panel did not appear in time.")

        # Collect all course elements.
        course_elements = page.locator('a[href^="/courses/"]')
        course_count = course_elements.count()
        courses = []

        for i in range(course_count):
            elem = course_elements.nth(i)
            href = elem.get_attribute("href")
            text = elem.inner_text().strip()
            # Extract course ID from the href (e.g., "/courses/212959")
            course_id = href.split("/")[2] if href and len(href.split("/")) > 2 else "unknown"
            courses.append({"name": text, "id": course_id})

        print("----- Courses Found -----")
        for course in courses:
            print(f"{course['name']} (ID: {course['id']})")
        print("----- End of Courses -----")

        browser.close()
        return courses
