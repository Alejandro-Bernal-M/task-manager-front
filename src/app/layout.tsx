import './globals.css'
import { StateContext } from '@/context/StateContext'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <StateContext>
        <Navigation />
        <body>{children}</body>
        <Footer />
      </StateContext>
    </html>
  )
}
