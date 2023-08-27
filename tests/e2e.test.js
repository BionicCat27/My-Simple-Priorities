import { connectAuthEmulator, createUserWithEmailAndPassword, deleteUser, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import puppeteer from "puppeteer";
import '../src/firebaseConfig';

const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");

const signInUser = async (auth, email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in:", user);
    } catch (error) {
        console.error("Error signing in:", error);
    }
};

const createUser = async (auth, email, password) => {
    try {
        // Call the function to create a user
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully');
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
        auth = getAuth();
        expect(auth).not.toBeNull();
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await createUser(auth, email, password);
        expect(auth.currentUser).toBeDefined();
    });

    it("navigates to the login page", async () => {
        await page.goto("http://localhost:5001");
        await page.waitForSelector("#pageTitle");
        const text = await page.$eval("#pageTitle", (e) => e.textContent);
        expect(text).toContain("Login");
    });


    // it("navigates to the todo page", async () => {
    //     expect(auth.currentUser).toBeDefined();
    //     await page.goto("http://localhost:5001/todo");
    //     await page.waitForSelector("#title");
    //     const text = await page.$eval("#title", (e) => e.textContent);
    //     expect(text).toContain("My Simple Todo");
    // });

    afterAll(() => {
        browser.close();
        if (auth.currentUser) {
            console.log("Deleting user");
            deleteUser(auth.currentUser);
        }
    });
});