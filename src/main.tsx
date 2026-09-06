import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import * as React from "react";
import "./styles.css";
import { registerServiceWorker } from "@/lib/pwa";

const router = getRouter();

// Registered for the whole site, not just /admin: the worker's scope has to
// cover "/" for the installed app to control every route it can navigate to.
// Deferred to the load event so it never competes with the first paint.
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    void registerServiceWorker();
  });
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
