import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const description =
  "James Gianoutsos: design work on data centre cooling that rejects heat to the air and uses water only when the community can spare it.";

export const metadata: Metadata = {
  title: { default: "James Gianoutsos", template: "%s · James Gianoutsos" },
  description,
  openGraph: { title: "James Gianoutsos", description, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
