const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch({ headless: false }); // Run in non-headless mode for debugging
        const page = await browser.newPage();

        // Use the absolute path to your HTML file
        const filePath = path.resolve(__dirname, 'stitch_mockups.html');
        const fileUrl = `file://${filePath}`;
        console.log(`[Puppeteer] Navigating to ${fileUrl}`);

        // Navigate to the file
        await page.goto(fileUrl, { waitUntil: 'load', timeout: 0 }); // Disable timeout
        console.log(`[Puppeteer] Page loaded successfully`);

        // Wait for the body element to ensure the page is fully loaded
        await page.waitForSelector('body', { timeout: 0 });
        console.log(`[Puppeteer] Body element found`);

        // Select all `.mockup` containers
        const mockups = await page.$$('.mockup'); // Select all elements with the class "mockup"

        console.log(`[Puppeteer] Found ${mockups.length} mockups to capture.`);

        // Loop through each mockup and take a screenshot
        for (let i = 0; i < mockups.length; i++) {
            const mockup = mockups[i];
            const screenshotPath = `mockup-${i + 1}.png`;

            // Take a screenshot of the specific mockup
            await mockup.screenshot({ path: screenshotPath });
            console.log(`[Puppeteer] Saved screenshot: ${screenshotPath}`);
        }

        // Close the browser
        await browser.close();
        console.log('[Puppeteer] Screenshot generation complete.');
    } catch (error) {
        console.error(`[Puppeteer] Unexpected error: ${error.message}`);
    }
})();