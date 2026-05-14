import SiteFooter from '../../components/SiteFooter'

export default function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      {children}
      <div style={{ width: '100%', maxWidth: 960 }}>
        <SiteFooter light />
      </div>
    </div>
  )
}
