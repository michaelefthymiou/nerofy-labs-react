import './Contact.css'

export default function Contact() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-grid"></div>
        <div className="page-header-beam"></div>
        <div className="page-header-corner"></div>
        <div className="page-header-corner-br"></div>
        <div className="page-header-content">
          <div className="page-header-eyebrow">
            <div className="page-header-eyebrow-line"></div>
            <span>Get In Touch</span>
          </div>
          <h1 className="page-header-title">Book a<br /><em>Consultation</em></h1>
          <p className="page-header-sub">Fill in the form below and we'll get back to you within 24 hours to discuss the right system for your home.</p>
        </div>
      </div>

      <div className="light-divider"></div>

      <section className="contact-section">
        <div className="contact-grid">

          <div className="contact-info">
            <div className="contact-info-corner"></div>
            <div className="section-eyebrow" style={{ marginBottom: '24px' }}>
              <div className="section-eyebrow-line"></div>
              <span>Contact Details</span>
            </div>
            <h2 className="contact-info-title">Let's find the right<br /><em>system for you.</em></h2>
            <p className="contact-info-body">
              Every home has different water needs. We'll assess your situation and recommend the most effective solution — whether that's a simple tap filter or a whole-home RO system.
            </p>
            <div className="contact-details">
              <div className="contact-detail">
                <span className="contact-detail-label">Email</span>
                <a href="mailto:info@nerofylabs.com" className="contact-detail-value">info@nerofylabs.com</a>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-label">Location</span>
                <span className="contact-detail-value">Cape Town, South Africa</span>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-label">Response Time</span>
                <span className="contact-detail-value">Within 24 hours</span>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap">
            <div className="contact-form-corner"></div>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" placeholder="Michael" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" placeholder="Smith" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="michael@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" placeholder="+27 82 000 0000" />
              </div>
              <div className="form-group">
                <label className="form-label">System of Interest</label>
                <select className="form-input form-select">
                  <option value="">Select a system...</option>
                  <option value="tap">Tap Filter</option>
                  <option value="shower">Shower Filter</option>
                  <option value="undersink">Undersink RO System</option>
                  <option value="wholehome">Whole-Home RO System</option>
                  <option value="unsure">Not Sure — Need Advice</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input form-textarea" placeholder="Tell us about your home and water needs..."></textarea>
              </div>
              <button type="submit" className="form-submit">
                Send Message <span className="form-submit-arrow">↗</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">
          <img src="/logo.png" alt="Nerofy Labs" />
          <span>Nerofy Labs</span>
        </div>
        <span className="footer-copy">© 2026 Nerofy Labs. All rights reserved.</span>
      </footer>
    </>
  )
}