import { createUserWithEmailAndPassword, deleteUser, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import puppeteer from "puppeteer";
process.env.MODE = "development";
import {enableDevelopmentMode} from '../src/firebaseConfig';
enableDevelopmentMode();

const signInUser = async (auth, email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.debug("User signed in");
    } catch (error) {
        console.error("Error signing in:", error);
    }
};

const createUser = async (auth, email, password) => {
    try {
        // Call the function to create a user
        await createUserWithEmailAndPassword(auth, email, password);
        console.debug('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        signInUser(auth, email, password);
    }
};

describe("App", () => {
    let browser;
    let page;
    let auth;
    let email = "logintestuser@testusers.com";
    let password = "testuser";

    beforeAll(async () => {
        expect(process.env.MODE).toBe("development");
        auth = getAuth();
        expect(auth).toBeDefined();
        browser = await puppeteer.launch({ headless: "new" });
        page = await browser.newPage();
        await createUser(auth, email, password);
        expect(auth.currentUser).toBeDefined();
    });

    // it("navigates to the login page", async () => {
    //     await page.goto("http://localhost:5002");
    //     await page.waitForNavigation();
    //     await page.waitForSelector("#pageTitle");
    //     const text = await page.$eval("#pageTitle", (e) => e.textContent);
    //     expect(text).toContain("Login");
        

    // });


    it("navigates to the todo page", async () => {
        await page.goto("http://localhost:5002");
        await page.waitForSelector("#pageTitle");
        const pageTitle = await page.$eval("#pageTitle", (e) => e.textContent);
        expect(pageTitle).toBe("Login")
        await page.$('#loginForm');
        await page.type('#loginFormEmail', "abcd1234");
        await page.type('#loginFormPassword', "abcd1234");
        await page.click('#loginButton');


        // await page.waitForNavigation();

        // const navButtons = await page.waitForSelector(".nav-button", (e) => e.textContent);
        // const todoNavButton = navButtons.evaluate((element) => element.textContent === "Todo");
        // expect(todoNavButton.textContent).toBe("Todo");
        // todoNavButton.click();
        // await page.waitForNavigation();
        // const text = await page.$eval("#title", (e) => e.textContent);
        // expect(text).toContain("My Simple Todo");
    });

    afterAll(() => {
        browser.close();
        if (auth?.currentUser) {
            console.debug("Deleting user");
            deleteUser(auth.currentUser);
        }
    });
});;