import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main>
      <section className="page-hero dark">
        <div className="container">
          <h1 className="page-title">This page has gone down the drain.</h1>
          <p className="page-lead">The link may be old or mistyped.</p>
          <div className="hero-actions">
            <Link to="/" className="btn btn-primary btn-lg">Home</Link>
            <Link to="/products" className="btn btn-ghost btn-lg">Shop filters</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
