import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastTrack — интервальное голодание",
  description: "Бесплатный трекер интервального голодания",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
