"""
Capture chaque slide de stitch_mockups.html en PNG via Playwright.
Utilise screenshot_element pour capturer uniquement le div de chaque slide.
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

HTML_FILE = Path(__file__).parent / "stitch_mockups.html"
OUTPUT_DIR = Path(__file__).parent / "export_png"
OUTPUT_DIR.mkdir(exist_ok=True)

SLIDES = [
    ("slide-1", "1_context.png"),
    ("slide-2", "2_one_click.png"),
    ("slide-3", "3_stand_out.png"),
    ("slide-4", "4_cultural_fit.png"),
    ("slide-5", "5_pricing.png"),
    ("slide-6", "6_promo_small.png"),
    ("slide-7", "7_promo_large.png"),
    ("slide-8", "8_web_template.png"),
]


async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        for slide_id, filename in SLIDES:
            print(f"Capturing {slide_id} -> {filename} ...")
            
            # Récupérer les dimensions du slide depuis le HTML
            page = await browser.new_page()
            await page.goto(HTML_FILE.as_uri())
            await page.wait_for_load_state("networkidle")
            
            # Récupérer les dimensions réelles du slide
            dims = await page.evaluate(f"""
                () => {{
                    const el = document.getElementById('{slide_id}');
                    const rect = el.getBoundingClientRect();
                    return {{ width: Math.round(rect.width), height: Math.round(rect.height) }};
                }}
            """)
            
            w = dims["width"]
            h = dims["height"]
            print(f"  Dimensions: {w}x{h}")
            
            # Resize viewport pour que le slide tienne correctement
            await page.set_viewport_size({"width": w, "height": h})
            
            # Recharger avec le bon viewport
            await page.reload()
            await page.wait_for_load_state("networkidle")
            
            # Mettre en screenshot-mode : cacher tout sauf le slide actif
            await page.evaluate(f"""
                () => {{
                    // Reset body styles
                    document.body.style.margin = '0';
                    document.body.style.padding = '0';
                    document.body.style.background = 'transparent';
                    document.body.style.gap = '0';
                    document.body.style.alignItems = 'flex-start';
                    
                    // Cacher tous les mockups
                    const mockups = document.querySelectorAll('.mockup');
                    mockups.forEach(m => {{
                        m.style.display = 'none';
                    }});
                    
                    // Afficher uniquement le slide actif
                    const active = document.getElementById('{slide_id}');
                    active.style.display = 'flex';
                    active.style.boxShadow = 'none';
                    active.style.borderRadius = '0';
                }}
            """)
            
            # Screenshot de l'élément uniquement
            element = page.locator(f"#{slide_id}")
            out_path = OUTPUT_DIR / filename
            await element.screenshot(path=str(out_path))
            print(f"  OK Saved: {out_path}")
            
            await page.close()
        
        await browser.close()
        print("\nOK Tous les slides captures !")


if __name__ == "__main__":
    asyncio.run(capture())
