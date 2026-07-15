import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

config.autoAddCss = false;

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Our Toon — Newcastle City Council",
  description:
    "Discover activities, clubs, and events across Newcastle upon Tyne — personalised with your Solid pod.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="h-dvh overflow-hidden font-sans text-foreground">
        <Script id="leaflet-no-3d" strategy="beforeInteractive">
          {`window.L_DISABLE_3D = true;`}
        </Script>
        {children}
      </body>
    </html>
  );
}
