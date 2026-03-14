const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log('Starting puppeteer...');
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless: 'new',
            dumpio: true,
            userDataDir: path.join(__dirname, '.puppeteer_temp'),
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disable-web-security']
        });
        const page = await browser.newPage();

        // Ensure good resolution and layout
        await page.setViewport({ width: 1920, height: 4000, deviceScaleFactor: 2 });

        const htmlPath = 'file:///' + path.join(__dirname, 'stitch_mockups.html').replace(/\\/g, '/');
        console.log(`Navigating to ${htmlPath}`);

        // We use load to not timeout if some tracking or slow fonts block networkidle
        await page.goto(htmlPath, { waitUntil: 'load', timeout: 60000 });
        console.log('Page loaded. Waiting 5 seconds for Tailwind CSS CDN and custom fonts to render completely...');

        await new Promise(r => setTimeout(r, 5000));

        const elements = await page.$$('.mockup');
        console.log(`Found ${elements.length} mockup elements.`);

        const outDir = path.join(__dirname, 'export_png');
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
        }

        const names = [
            '1_context',
            '2_one_click',
            '3_stand_out',
            '4_cultural_fit',
            '5_pricing',
            '6_promo_small',
            '7_promo_large',
            '8_web_template'
        ];

        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const name = names[i] || `mockup_${i + 1}`;
            const outPath = path.join(outDir, `${name}.png`);
            await el.screenshot({ path: outPath, omitBackground: true });
            console.log(`✅ Saved ${outPath}`);
        }

        await browser.close();
        console.log('🎉 Extracted all mockups successfully!');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
})();
