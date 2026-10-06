import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/providers/AuthProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "TicketBari - Book Bus, Train, Launch & Flight Tickets Online",
  description:
    "Bangladesh's premier online ticket booking platform. Discover and book bus, train, launch, and flight tickets easily with TicketBari. Best prices, instant confirmation.",
  keywords: "ticket booking, bus ticket, train ticket, flight ticket, launch ticket, Bangladesh, Dhaka, Chittagong, online booking",
  authors: [{ name: "TicketBari" }],
  referrer: "no-referrer",
  metadataBase: new URL("https://ticketbari.com"),
  openGraph: {
    title: "TicketBari - Bangladesh's Best Ticket Booking Platform",
    description: "Book bus, train, launch & flight tickets online. Best prices, instant booking, secure payment.",
    type: "website",
    locale: "en_BD",
    siteName: "TicketBari",
  },
  twitter: {
    card: "summary_large_image",
    title: "TicketBari - Book Tickets Online",
    description: "Bangladesh's premier online ticket booking platform.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className={`${outfit.variable} ${spaceGrotesk.variable}`}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#0d1230",
                  color: "#e2e8f0",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  fontFamily: "Outfit, sans-serif",
                },
                success: {
                  iconTheme: { primary: "#10b981", secondary: "#fff" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#fff" },
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
