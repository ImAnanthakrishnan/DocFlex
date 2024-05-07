import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import store, { persistor } from "./app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ChakraProvider } from "@chakra-ui/react";

import ChatProvider from "./context/ChatProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        {
          <PersistGate persistor={persistor} loading={null}>
            <ToastContainer
              theme="dark"
              position="top-right"
              autoClose={1000}
              closeOnClick
              pauseOnHover={false}
            />
            <ChatProvider>
              <ChakraProvider>
                <App />
              </ChakraProvider>
            </ChatProvider>
          </PersistGate>
        }
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
