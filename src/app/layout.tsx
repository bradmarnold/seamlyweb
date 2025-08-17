import './globals.css'
import { CommandProvider } from '@/contexts/CommandContext'
import { MeasurementsProvider } from '@/contexts/MeasurementsContext'

export const metadata = {
  title: 'SeamlyWeb - CAD Pattern Making',
  description: 'Web-based CAD application compatible with Seamly2D for pattern making',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <CommandProvider>
          <MeasurementsProvider>
            {children}
          </MeasurementsProvider>
        </CommandProvider>
      </body>
    </html>
  )
}