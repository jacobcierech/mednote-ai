import './globals.css'

export const metadata = {
  title: 'MedNote AI | Therapy Documentation Workspace',
  description:
    'AI documentation assistant for pediatric and outpatient therapy. Reduce documentation burnout, save time, and keep clinician oversight front and center.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
