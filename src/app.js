import React from 'react';
import ReacDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './firebaseConfig';

//Components
import LoginPage from './pages/login/loginPage.js';
import SignupPage from './pages/signup/signupPage.js';
import NotFoundPage from './pages/notFound/notFoundPage.js';
import HomePage from './pages/home/homePage';
import { AuthProvider } from './contexts/AuthContext';
import { DBProvider } from './contexts/DBContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { TypesProvider } from './contexts/TypesContext';
import { ViewsProvider } from './contexts/ViewsContext';
import TypesPage from './pages/types/typesPage';
import TypePage from './pages/type/typePage';
import ViewsPage from './pages/views/viewsPage';
import ViewPage from './pages/view/viewPage';
import EditViewPage from './pages/editview/editViewPage';
import EditTypePage from './pages/edittype/editTypePage';
import TypeDataPage from './pages/typedata/typeDataPage';

const App = () => {
    return (
        <NavigationProvider>
            <AuthProvider>
                <DBProvider>
                    <TypesProvider>
                        <ViewsProvider>
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/signup" element={<SignupPage />} />
                                    <Route path="/types" element={<TypesPage />} />
                                    <Route path="/type" element={<TypePage />} />
                                    <Route path="/views" element={<ViewsPage />} />
                                    <Route path="/view" element={<ViewPage />} />
                                    <Route path="/editview" element={<EditViewPage />} />
                                    <Route path="/edittype" element={<EditTypePage />} />
                                    <Route path="/data" element={<TypeDataPage />} />
                                    <Route path="*" element={<NotFoundPage />} />
                                </Routes >
                            </BrowserRouter >
                        </ViewsProvider>
                    </TypesProvider>
                </DBProvider>
            </AuthProvider>
        </NavigationProvider>
    );
};

ReacDOM.render(
    <App />, document.getElementById("page_root")
);