import { chromium } from "playwright";

const cdpEndpoint = process.env.ASK_PROJECT_ELECTRON_CDP ?? "http://127.0.0.1:9222";
const pageUrlPrefix = process.env.ASK_PROJECT_DESKTOP_URL ?? "http://localhost:4000";

const getRendererPage = async (context) => {
  const pages = context.pages();
  return pages.find((page) => page.url().startsWith(pageUrlPrefix)) ?? pages[0];
};

const main = async () => {
  const browser = await chromium.connectOverCDP(cdpEndpoint);

  try {
    const context = browser.contexts()[0];
    if (!context) {
      throw new Error(`CDP endpoint has no browser context: ${cdpEndpoint}`);
    }

    const page = await getRendererPage(context);
    if (!page) {
      throw new Error(`CDP endpoint has no renderer pages: ${cdpEndpoint}`);
    }

    await page.waitForLoadState("domcontentloaded");

    const info = {
      title: await page.title(),
      url: page.url(),
      hasElectronBridge: await page.evaluate(() => Boolean(window.askProjectDesktop)),
      bridgeKeys: await page.evaluate(() =>
        window.askProjectDesktop ? Object.keys(window.askProjectDesktop) : [],
      ),
      buttons: await page.locator("button").evaluateAll((buttons) =>
        buttons.map((button) => ({
          text: button.innerText,
          ariaLabel: button.getAttribute("aria-label"),
          disabled: button.disabled,
        })),
      ),
    };

    console.log(JSON.stringify(info, null, 2));
  } finally {
    await browser.close();
  }
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[debug:desktop:agent] ${message}`);
  process.exit(1);
});
