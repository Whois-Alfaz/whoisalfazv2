export const metadata = {
  title: 'Sanity Studio',
  description: 'Content management studio',
  robots: {
    index: false,
    follow: false,
  },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="sanity-studio"
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      {children}
    </div>
  )
}
