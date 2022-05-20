import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";
import globalStyles from "~/styles/global.css";

// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=Source+Sans+Pro:wght@400;700&display=swap" rel="stylesheet">
export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStyles,
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=Source+Sans+Pro:wght@400;700&display=swap",
    },
  ]
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {
          typeof document === "undefined"
          ? "__STYLES__"
          : null
        }
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
