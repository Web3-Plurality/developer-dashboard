import { ProjectProvider } from "@/contexts/ProjectContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ProjectProvider>{children}</ProjectProvider>
      </body>
    </html>
  )
}



import './globals.css'