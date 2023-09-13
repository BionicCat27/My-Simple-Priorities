import { createUserWithEmailAndPassword, deleteUser, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import puppeteer from "puppeteer";
process.env.MODE = "development";
import {app, enableDevelopmentMode} from '../src/firebaseConfig';
import {DBProvider, addData} from '../src/contexts/DBContext';
import render from 'pptr-testing-library'
import React from "react";
enableDevelopmentMode();

const createUser = async (auth, email, password) => {
    try {
        // Call the function to create a user
        await createUserWithEmailAndPassword(auth, email, password);
        console.debug('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

describe("App", () => {
    let browser;
    let page;
    let auth;
    let baseUrl = "http://127.0.0.1:5002";
    let email = "logintestuser@testusers.com";
    let password = "testuser";

    beforeAll(async () => {
        expect(process.env.MODE).toBe("development");
        auth = getAuth();
        expect(auth).toBeDefined();
        await createUser(auth, email, password);
        expect(auth.currentUser).toBeDefined();
        browser = await puppeteer.launch({ headless: "new" });
        browser.createIncognitoBrowserContext();
    });

    beforeEach(async () => {
        browser = await puppeteer.launch({ headless: "new" });
        page = await browser.newPage();
    });

    it("logs user in successfully", async () => {
        await page.goto(baseUrl);
        expect(page.url()).toBe(`${baseUrl}/login`)
        await page.waitForSelector("#pageTitle");
        const text = await page.$eval("#pageTitle", (e) => e.textContent);
        expect(text).toContain("Login");
        await page.$('#loginForm');
        await page.type('#loginFormEmail', email);
        await page.type('#loginFormPassword', password);
        await page.click('#loginButton');
        await page.waitForSelector("#sidebarTitle");
        const sidebarTitle = await page.$eval("#sidebarTitle", (e) => e.textContent);
        expect(sidebarTitle).toContain("My SimpleCapture");
    });


    it("fails to login invalid user", async () => {
        await page.goto(baseUrl);   
        expect(page.url()).toBe(`${baseUrl}/login`)
        await page.waitForSelector("#pageTitle");
        const pageTitle = await page.$eval("#pageTitle", (e) => e.textContent);
        expect(pageTitle).toBe("Login")
        await page.$('#loginForm');
        await page.type('#loginFormEmail', "abcd1234");
        await page.type('#loginFormPassword', "abcd1234");
        await page.click('#loginButton');
        await page.waitForSelector("#login-error-message");
        const loginErrorMessage = await page.$eval("#login-error-message", (e) => e.textContent);
        expect(loginErrorMessage).toBe("Incorrect username or password.")
    });

    afterEach(() => {
        page.close();
    });

    afterAll(() => {
        browser.close();
        if (auth?.currentUser) {
            console.debug("Deleting user");
            deleteUser(auth.currentUser);
        }
    });
});

describe("DBContext", () => {
    let browser;
    let page;
    let auth;
    let baseUrl = "http://127.0.0.1:5002";
    let email = "logintestuser@testusers.com";
    let password = "testuser";

    const DBContextComponent = () => {
        const { addData } = useContext(DBContext);
        console.debug("Adding note:");
        addData("data", {"Note": "Note!!!!!"});
        return null;
    }

    it.skip("pushes new object", async () => {
        const pagecontent = render(
            <DBProvider>
                <DBContextComponent />
            </DBProvider>
        )
    });
});