import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster, toast } from "sonner";
import HomePage from "./pages/HomePage.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <>

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 1000,
      }}
      richColors
      closeButton
    />
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
