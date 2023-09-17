import { createUserWithEmailAndPassword, deleteUser, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import puppeteer from "puppeteer";
process.env.MODE = "development";
import { app, enableDevelopmentMode } from '../src/firebaseConfig';
enableDevelopmentMode();

const baseUrl = "http://127.0.0.1:5002";
const email = "logintestuser@testusers.com";
const password = "testuser";

const createUserOrSignIn = async (auth, email, password) => {
    try {
        // Call the function to create a user
        await createUserWithEmailAndPassword(auth, email, password);
        console.debug('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                console.error(error)
            });
    }
};
const doFormLogin = async (page, email, password) => {
    expect(page.url()).toBe(`${baseUrl}/login`)
    await page.$('#loginForm');
    await page.type('#loginFormEmail', email);
    await page.type('#loginFormPassword', password);
    await page.click('#loginButton');
};

describe("App", () => {
    let browser;
    let page;
    let auth;
    let baseUrl = "http://localhost:5000";
    let email = "logintestuser@testusers.com";
    let password = "testuser";

    beforeAll(async () => {
        expect(process.env.MODE).toBe("development");
        auth = getAuth();
        expect(auth).toBeDefined();
        await createUserOrSignIn(auth, email, password);
        expect(auth.currentUser).toBeDefined();
    });

    beforeEach(async () => {
        browser = await puppeteer.launch({ headless: "new" });
        browser.createIncognitoBrowserContext();
        page = await browser.newPage();
    });

    it("logs user in successfully", async () => {
        await page.goto(baseUrl);
        expect(page.url()).toBe(`${baseUrl}/login`)
        await doFormLogin(page, email, password)
        await page.waitForSelector("#sidebarTitle");
        const sidebarTitle = await page.$eval("#sidebarTitle", (e) => e.textContent);
        expect(sidebarTitle).toContain("My SimpleCapture");
    });


    it("fails to login invalid user", async () => {
        await page.goto(baseUrl);
        await doFormLogin(page, "acbd1234", "acbd1234")
        await page.waitForSelector("#login-error-message");
        const loginErrorMessage = await page.$eval("#login-error-message", (e) => e.textContent);
        expect(loginErrorMessage).toBe("Incorrect username or password.")
    });

    afterEach(() => {
        page.close();
    });

    afterAll(() => {
        browser.close();
    });
});

describe("Capture page", () => {
    jest.mock('../src/contexts/AuthContext', () => ({
        checkLoggedIn: jest.fn()
    }));

    let browser;
    let page;
    let auth;
    beforeAll(async () => {
        expect(process.env.MODE).toBe("development");
        auth = getAuth();
        expect(auth).toBeDefined();
        await createUserOrSignIn(auth, email, password);
        expect(auth.currentUser).toBeDefined();
    });

    beforeEach(async () => {
        browser = await puppeteer.launch({ headless: "new" });
        page = await browser.newPage();
    });

    it("adds a note", async () => {
        await page.goto(`${baseUrl}`);
        await doFormLogin(page, email, password);
        await page.waitForSelector("#capture-input")
        await page.type("#capture-input", "New Note");
    })

    afterEach(() => {
        page.close();
    });

    afterAll(() => {
        console.debug("Deleting user");
        deleteUser(auth.currentUser);
        browser.close();
    });
})

// describe("DBContext", () => {
//     let browser;
//     let page;
//     let auth;

//     const DBContextComponent = () => {
//         const { addData } = useContext(DBContext);
//         console.debug("Adding note:");
//         addData("data", { "Note": "Note!!!!!" });
//         return null;
//     }

//     it.skip("pushes new object", async () => {
//         const pagecontent = render(
//             <DBProvider>
//                 <DBContextComponent />
//             </DBProvider>
//         )
//     });
// });
