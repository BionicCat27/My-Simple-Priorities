import puppeteer from "puppeteer";

describe("Login page", () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    it("navigates to the login page", async () => {
        await page.goto("http://localhost:5001");
        await page.waitForSelector("#pageTitle");
        const text = await page.$eval("#pageTitle", (e) => e.textContent);
        expect(text).toContain("Login");
    });
    afterAll(() => browser.close());
});