import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import Upload from "./pages/points-competition/upload";
import Color from "./pages/points-competition/color"

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ChakraProvider>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/upload" element={<Upload />} />
          <Route path="/color" element={<Color />} />
          <Route path="*" element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>
);
