import "./globals.css";

export const metadata = {
  title: "Bharat AI Automation Labs — Save Time, Increase Leads, Recover Lost Opportunities and Reduce Manual Work",
  description:
    "AI Systems That Help Businesses Save Time and Recover Lost Opportunities. Practical AI workflows for lead follow-up, document processing, customer communication, and internal operations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
