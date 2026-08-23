import "./globals.css";

const siteUrl = "https://www.bharataiautomationlabs.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bharat AI Automation Labs — Save Time, Increase Leads, Recover Lost Opportunities and Reduce Manual Work",
  description:
    "AI Systems That Help Businesses Save Time and Recover Lost Opportunities. Practical AI workflows for lead follow-up, document processing, customer communication, and internal operations.",
  openGraph: {
    title: "Bharat AI Automation Labs",
    description: "AI Automation for Modern Business",
    url: siteUrl,
    siteName: "Bharat AI Automation Labs",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Bharat AI Automation Labs — AI Automation for Modern Business",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bharat AI Automation Labs",
    description: "AI Automation for Modern Business",
    images: ["/api/og"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
