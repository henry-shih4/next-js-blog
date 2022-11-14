import "../styles/globals.css";
import { createContext, useState, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function MyApp({ Component, pageProps }) {
  const token = cookies.get("TOKEN");

  return <Component {...pageProps} />;
}

export default MyApp;
