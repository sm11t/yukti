# canvas_scraper.py

from playwright.sync_api import sync_playwright, TimeoutError
import time

def login_and_get_courses(username, password):
    """
    Logs into Canvas in non-headless mode, waits 20 seconds for DUO verification,
    clicks the Courses button, and then pauses to let you inspect the side panel.
    It then attempts to find the nested container with the courses, prints its HTML,
    and collects each course's text.
    """
    with sync_playwright() as p:
        # Launch in non-headless mode so you can observe the process.
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

        # Wait 20 seconds for DUO verification on the user's mobile.
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

        # Pause to observe the side panel opening.
        print("Pausing for 5 seconds after clicking Courses button...")
        time.sleep(5)
        page.screenshot(path="after_courses_click.png")

        # Wait for the courses side panel container to appear.
        try:
            page.wait_for_selector('.css-1t5l7tc-view--block-list', timeout=30000)
            print("Courses side panel container appeared.")
        except TimeoutError:
            browser.close()
            raise Exception("Courses panel did not appear in time.")

        # Locate the main container of the side panel.
        container = page.locator('.css-1t5l7tc-view--block-list')
        container_html = container.inner_html()
        print("Courses container HTML:\n", container_html)
        time.sleep(5)  # Pause to allow visual inspection

        # Get all list items within the container.
        list_items_locator = container.locator('.css-kryo2y-view-listItem')
        list_items_count = list_items_locator.count()
        print("Found", list_items_count, "list items in the side panel container.")

        if list_items_count < 3:
            print("Not enough list items found. Pausing 5 seconds for manual inspection.")
            time.sleep(5)

        # We assume the third list item holds the actual courses.
        courses_container = list_items_locator.nth(2).locator('.css-1t5l7tc-view--block-list')
        # Take a screenshot of the nested courses container.
        courses_container.screenshot(path="courses_container.png")
        time.sleep(5)

        # Now, each course should be in a css-kryo2y-view-listItem inside the nested container.
        course_items = courses_container.locator('.css-kryo2y-view-listItem')
        course_count = course_items.count()
        print("Found", course_count, "course items in the nested container.")
        time.sleep(5)

        courses = []
        for i in range(course_count):
            elem = course_items.nth(i)
            text = elem.inner_text().strip()
            # Expecting the text to contain course details, e.g.:
            # Line 1: Course Name
            # Line 2: Course Number
            # Line 3: Term
            parts = text.split("\n")
            if len(parts) >= 3:
                course_name = parts[0].strip()
                course_number = parts[1].strip()
                term = parts[2].strip()
            else:
                course_name = text
                course_number = "unknown"
                term = "unknown"
            courses.append({"name": course_name, "number": course_number, "term": term})

        print("----- Courses Found -----")
        for course in courses:
            print(f"{course['name']} (Number: {course['number']}, Term: {course['term']})")
        print("----- End of Courses -----")

        browser.close()
        return courses
