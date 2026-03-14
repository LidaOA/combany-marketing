from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# Path to ChromeDriver
chrome_driver_path = "C:\\path\\to\\chromedriver.exe"

# Path to your HTML file
html_file = "file:///D:/path/to/stitch_mockups.html"

# Set up Chrome options
options = Options()
options.add_argument("--headless")
options.add_argument("--window-size=1920,1080")

# Start WebDriver
service = Service(chrome_driver_path)
driver = webdriver.Chrome(service=service, options=options)

try:
    # Open the HTML file
    driver.get(html_file)

    # Find all `.mockup` elements
    mockups = driver.find_elements(By.CLASS_NAME, "mockup")
    print(f"Found {len(mockups)} mockups.")

    # Loop through each mockup and take a screenshot
    for i, mockup in enumerate(mockups):
        screenshot_path = f"mockup-{i + 1}.png"
        mockup.screenshot(screenshot_path)
        print(f"Saved screenshot: {screenshot_path}")
finally:
    driver.quit()