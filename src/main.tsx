import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import GalleryPage from "./pages/gallery.tsx";
import RSVPPage from "./pages/rsvp.tsx";
import Layout from "./components/layout.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <StrictMode>
      <BrowserRouter>
        <Layout />

        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/album" element={<GalleryPage />} />
          <Route path="/rsvp" element={<RSVPPage />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </>
);
