import './admin.css';
import Script from 'next/script';

export const metadata = {
  title: 'SolarVista Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return (
    // The html/body wrapper is handled by the root layout.
    // However, the admin panel needs a specific theme data attribute on a container
    // or we can just render the children here because the root layout <body> will wrap it.
    // We can wrap it in a div with data-theme="dark" to match original styling context if needed,
    <div data-theme="dark" style={{ height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="admin-root-container">
      <link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet" precedence="default" />
      
      {/* Quill JS script */}
      <Script src="https://cdn.quilljs.com/1.3.7/quill.js" strategy="lazyOnload" />

      {children}
    </div>
  );
}
