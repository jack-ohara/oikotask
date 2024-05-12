"use client";

import { useEffect } from "react";

export default function ServiceWorker() {
  useEffect(() => {
    console.log("checing navigator");
    if ("serviceWorker" in navigator) {
      console.log("registering service worker");
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

  return <div className="hidden" />;
}
