import "../styles/globals.css";
import { createContext, useState, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { LoginProvider } from "../context/LoginContext";

function MyApp({ Component, pageProps }) {
  const cookie = cookies.get("TOKEN");

  return (
    <>
      <LoginProvider>
        <Component {...pageProps} cookie={cookie} />
      </LoginProvider>
    </>
  );
}

export default MyApp;
