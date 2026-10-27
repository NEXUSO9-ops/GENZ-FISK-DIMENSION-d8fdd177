import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "OMEGA-9 Voice Core",
  description: "A focused voice channel for ideas, questions, and clear thinking.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
