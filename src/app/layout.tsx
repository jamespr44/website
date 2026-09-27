import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const description =
  "An interactive walk through a literature review on rejecting data centre heat without draining constrained community water supply, using a warm chilled water plant with trigger-based adiabatic assist.";

export const metadata: Metadata = {
  title: "Cooling the cloud without draining the tap · James Gianoutsos",
  description,
  openGraph: {
    title: "Cooling the cloud without draining the tap",
    description,
    type: "article",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
