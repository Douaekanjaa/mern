import React from 'react';

function Footer() {
    function StarRating({ count = 5, filled = 5, size = 14 }) {
    return (
        <div style={{ display: "flex", gap: 2 }}>
        {[...Array(count)].map((_, i) => (
            <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < filled ? "#f59e0b" : "#e5e5e5"} stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ))}
        </div>
    );
    }
    return (
      <footer style={{ borderTop: "1px solid var(--border)", padding: "64px clamp(20px, 4vw, 56px) 36px", background: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "var(--green)" }}>Bricole</span>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--ink-4)", lineHeight: 1.85, maxWidth: 240, marginBottom: 24 }}>Morocco's trusted platform for home services. Book with confidence, every time.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["𝕏", "in", "f"].map((s, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer", transition: "all .2s", color: "var(--ink-3)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.color = "var(--green)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink-3)"; }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: "Services", links: ["Car Washing", "House Cleaning", "Gardening", "Electrical", "Plumbing", "Painting"] },
              { title: "Company", links: ["About us", "Blog", "Contact", "Become a Pro", "Careers"] },
              { title: "Support", links: ["Help Center", "FAQ", "Pricing", "Safety"] },
              { title: "Legal", links: ["Terms of use", "Privacy Policy", "Cookie Policy", "Sitemap"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 18, fontWeight: 700 }}>{col.title}</div>
                {col.links.map(l => <a key={l} className="footer-link" href="#">{l}</a>)}
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: "var(--border)", marginBottom: 24 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "var(--ink-4)" }}>© 2024 Bricole. All rights reserved.</span>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--ink-4)" }}>Made with ❤️ in Morocco</span>
              <div style={{ display: "flex", gap: 3 }}>
                <StarRating size={11} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--green)" }}>4.9 rated platform</span>
            </div>
          </div>
        </div>
      </footer>
    );
}

export default Footer;
