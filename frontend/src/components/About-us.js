import React, { useEffect, useRef, useState } from 'react';

const AboutUs = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, index]));
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(ref);
      return observer;
    });
    return () => observers.forEach(obs => obs && obs.disconnect());
  }, []);

  const addRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  const categories = [
    { icon: '✦', label: 'Skin Care', desc: 'Glow from within', color: '#ffd1d4' },
    { icon: '✧', label: 'Hair Care', desc: 'Nourish every strand', color: '#ffe0b2' },
    { icon: '❋', label: 'Fashion', desc: 'Dress your story', color: '#f8bbd9' },
    { icon: '◈', label: 'Jewellery', desc: 'Shine in every detail', color: '#e1bee7' },
    { icon: '✿', label: 'Cosmetics', desc: 'Beauty, redefined', color: '#ffd1d4' },
    { icon: '⬡', label: 'Kitchen Ware', desc: 'Cook with love', color: '#b2dfdb' },
    { icon: '❀', label: 'Decoration', desc: 'Style your space', color: '#fff9c4' },
  ];

  const values = [
    {
      number: '01',
      title: 'Curated Quality',
      desc: 'Every product on Zedify is hand-selected for quality, authenticity, and value. We believe you deserve the best — always.'
    },
    {
      number: '02',
      title: 'Women First',
      desc: 'Built by women, for women. We understand your needs because we live them. Zedify is your trusted companion in everyday life.'
    },
    {
      number: '03',
      title: 'Affordable Luxury',
      desc: 'Premium doesn\'t have to mean expensive. We work tirelessly to bring you luxurious products at prices that make sense.'
    },
    {
      number: '04',
      title: 'Rooted in Pakistan',
      desc: 'Proudly Pakistani. We celebrate local craftsmanship while bringing global trends to your doorstep.'
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .zedify-about {
          font-family: 'DM Sans', sans-serif;
          color: #2d1f1f;
          background: #fffaf9;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero {
          min-height: 92vh;
          background: linear-gradient(145deg, #fe7e8b 0%, #e65c70 60%, #c0394e 100%);
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 5rem 6vw 4rem;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 80% at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 40% at 10% 90%, rgba(255,180,180,0.2) 0%, transparent 60%);
        }

        .hero-text { position: relative; z-index: 2; }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          margin-bottom: 1.5rem;
        }

        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: rgba(255,255,255,0.5);
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 5vw, 5.5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.05;
          margin-bottom: 1.8rem;
        }

        .hero-title em {
          font-style: italic;
          color: #ffd1d4;
        }

        .hero-desc {
          font-size: 1.05rem;
          line-height: 1.85;
          color: rgba(255,255,255,0.85);
          max-width: 480px;
          font-weight: 300;
          margin-bottom: 2.5rem;
        }

        .hero-stat-row {
          display: flex;
          gap: 2.5rem;
        }

        .hero-stat { color: white; }
        .hero-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 600;
          line-height: 1;
        }
        .hero-stat-label {
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          margin-top: 0.3rem;
        }

        /* Hero visual side */
        .hero-visual {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-blob-wrap {
          position: relative;
          width: clamp(280px, 35vw, 460px);
          height: clamp(280px, 35vw, 460px);
        }

        .hero-blob {
          width: 100%;
          height: 100%;
          border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: blobMorph 8s ease-in-out infinite;
          backdrop-filter: blur(10px);
        }

        @keyframes blobMorph {
          0%,100% { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
          33%      { border-radius: 45% 55% 40% 60% / 60% 40% 55% 45%; }
          66%      { border-radius: 50% 50% 60% 40% / 40% 55% 45% 60%; }
        }

        .hero-blob-inner {
          text-align: center;
          color: white;
        }

        .hero-blob-brand {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          letter-spacing: 0.05em;
          display: block;
          line-height: 1;
        }

        .hero-blob-tagline {
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-top: 0.5rem;
        }

        .floating-tag {
          position: absolute;
          background: white;
          border-radius: 50px;
          padding: 0.6rem 1.1rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: #e65c70;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          white-space: nowrap;
          animation: floatY 4s ease-in-out infinite;
        }

        .floating-tag:nth-child(2) { top: 8%; right: -5%; animation-delay: 0s; }
        .floating-tag:nth-child(3) { bottom: 18%; left: -8%; animation-delay: 1.5s; }
        .floating-tag:nth-child(4) { top: 40%; right: -12%; animation-delay: 3s; }

        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }

        /* ── WAVE DIVIDER ── */
        .wave-divider { display: block; width: 100%; overflow: hidden; line-height: 0; }
        .wave-divider svg { display: block; width: 100%; }

        /* ── STORY SECTION ── */
        .story-section {
          padding: 7rem 8vw 5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
          background: #fffaf9;
        }

        .section-label {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #fe7e8b;
          margin-bottom: 1rem;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 700;
          line-height: 1.15;
          color: #2d1f1f;
          margin-bottom: 1.5rem;
        }

        .section-title span { color: #fe7e8b; }

        .section-body {
          font-size: 1rem;
          line-height: 1.9;
          color: #6b5a5a;
          font-weight: 300;
        }

        .story-visual {
          position: relative;
        }

        .story-card {
          background: linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%);
          border-radius: 24px;
          padding: 3.5rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .story-card::before {
          content: '"';
          position: absolute;
          top: -1rem;
          left: 2rem;
          font-family: 'Playfair Display', serif;
          font-size: 10rem;
          color: rgba(255,255,255,0.1);
          line-height: 1;
          font-style: italic;
        }

        .story-quote {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-style: italic;
          line-height: 1.65;
          position: relative;
          z-index: 1;
          margin-bottom: 1.5rem;
        }

        .story-author {
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
        }

        .story-accent {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }

        /* ── CATEGORIES ── */
        .categories-section {
          padding: 6rem 6vw;
          background: linear-gradient(180deg, #fff5f6 0%, #fffaf9 100%);
        }

        .categories-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .category-card {
          background: white;
          border-radius: 20px;
          padding: 2rem 1.5rem;
          text-align: center;
          border: 1.5px solid #f5e6e8;
          transition: all 0.35s ease;
          cursor: default;
          position: relative;
          overflow: hidden;
        }

        .category-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #fe7e8b, #e65c70);
          opacity: 0;
          transition: opacity 0.35s ease;
          border-radius: 20px;
        }

        .category-card:hover::before { opacity: 1; }

        .category-card:hover .cat-icon,
        .category-card:hover .cat-label,
        .category-card:hover .cat-desc { color: white; }

        .cat-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          color: #fe7e8b;
          position: relative;
          z-index: 1;
          transition: color 0.35s ease;
          display: block;
        }

        .cat-label {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #2d1f1f;
          position: relative;
          z-index: 1;
          transition: color 0.35s ease;
          display: block;
          margin-bottom: 0.4rem;
        }

        .cat-desc {
          font-size: 0.78rem;
          color: #b09090;
          position: relative;
          z-index: 1;
          transition: color 0.35s ease;
        }

        /* ── VALUES ── */
        .values-section {
          padding: 7rem 8vw;
          background: #2d1f1f;
          position: relative;
          overflow: hidden;
        }

        .values-section::before {
          content: 'ZEDIFY';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Playfair Display', serif;
          font-size: clamp(6rem, 15vw, 18rem);
          font-weight: 700;
          color: rgba(255,255,255,0.03);
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: 0.1em;
        }

        .values-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .values-header .section-label { color: #fe7e8b; }
        .values-header .section-title { color: white; }

        .values-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          position: relative;
          z-index: 1;
        }

        .value-item {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
          display: flex;
          gap: 1.5rem;
        }

        .value-number {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 700;
          color: rgba(254,126,139,0.25);
          line-height: 1;
          flex-shrink: 0;
          width: 60px;
        }

        .value-content {}

        .value-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.75rem;
        }

        .value-desc {
          font-size: 0.92rem;
          line-height: 1.85;
          color: rgba(255,255,255,0.55);
          font-weight: 300;
        }

        /* ── PROMISE ── */
        .promise-section {
          padding: 7rem 8vw;
          text-align: center;
          background: #fffaf9;
        }

        .promise-pill {
          display: inline-block;
          background: linear-gradient(135deg, #fe7e8b, #e65c70);
          color: white;
          border-radius: 50px;
          padding: 0.4rem 1.2rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .promise-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          color: #2d1f1f;
          max-width: 700px;
          margin: 0 auto 1.5rem;
          line-height: 1.2;
        }

        .promise-title em { color: #fe7e8b; font-style: italic; }

        .promise-desc {
          font-size: 1.05rem;
          line-height: 1.9;
          color: #6b5a5a;
          max-width: 560px;
          margin: 0 auto 3.5rem;
          font-weight: 300;
        }

        .promise-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .feature-chip {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: white;
          border: 1.5px solid #f5e6e8;
          border-radius: 50px;
          padding: 0.65rem 1.3rem;
          font-size: 0.88rem;
          font-weight: 500;
          color: #2d1f1f;
          transition: all 0.25s ease;
        }

        .feature-chip:hover {
          background: #fe7e8b;
          color: white;
          border-color: #fe7e8b;
        }

        .feature-chip-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fe7e8b;
          flex-shrink: 0;
          transition: background 0.25s ease;
        }

        .feature-chip:hover .feature-chip-dot { background: white; }

        /* ── CTA ── */
        .cta-section {
          background: linear-gradient(135deg, #fe7e8b 0%, #e65c70 50%, #c0394e 100%);
          padding: 6rem 8vw;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -20%;
          width: 60%;
          height: 200%;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }

        .cta-section::after {
          content: '';
          position: absolute;
          bottom: -50%;
          right: -10%;
          width: 50%;
          height: 150%;
          background: rgba(255,255,255,0.04);
          border-radius: 50%;
        }

        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        .cta-sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.8);
          margin-bottom: 2.5rem;
          font-weight: 300;
          position: relative;
          z-index: 1;
        }

        .cta-btn {
          display: inline-block;
          background: white;
          color: #e65c70;
          border: none;
          border-radius: 50px;
          padding: 1rem 2.8rem;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
          text-decoration: none;
        }

        .cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.2);
        }

        /* ── ANIMATE ON SCROLL ── */
        .fade-up {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .fade-up-delay-1 { transition-delay: 0.1s; }
        .fade-up-delay-2 { transition-delay: 0.2s; }
        .fade-up-delay-3 { transition-delay: 0.3s; }
        .fade-up-delay-4 { transition-delay: 0.4s; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; text-align: center; padding: 4rem 6vw 3rem; min-height: auto; padding-top: 5rem; }
          .hero-desc { margin: 0 auto 2rem; }
          .hero-stat-row { justify-content: center; }
          .hero-visual { margin-top: 3rem; }
          .floating-tag:nth-child(4) { display: none; }
          .story-section { grid-template-columns: 1fr; gap: 3rem; padding: 4rem 6vw; }
          .values-grid { grid-template-columns: 1fr; }
          .categories-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
        }

        @media (max-width: 500px) {
          .hero-blob-wrap { width: 240px; height: 240px; }
          .floating-tag:nth-child(3) { display: none; }
          .promise-features { gap: 0.75rem; }
        }
      `}</style>

      <div className="zedify-about">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-text">
            <div className="hero-eyebrow">Our Story</div>
            <h1 className="hero-title">
              Beauty.<br />
              Style. <em>Life.</em><br />
              All in One.
            </h1>
            <p className="hero-desc">
              Zedify is more than a store — it's a destination where every woman discovers
              products that celebrate her beauty, elevate her home, and simplify her everyday.
            </p>
            <div className="hero-stat-row">
              <div className="hero-stat">
                <div className="hero-stat-num">7+</div>
                <div className="hero-stat-label">Categories</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">500+</div>
                <div className="hero-stat-label">Products</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-label">Curated</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-blob-wrap">
              <div className="hero-blob">
                <div className="hero-blob-inner">
                  <span className="hero-blob-brand">Zedify</span>
                  <p className="hero-blob-tagline">Shop Everything</p>
                </div>
              </div>
              <div className="floating-tag">✦ Skin Care</div>
              <div className="floating-tag">❋ Fashion & Jewellery</div>
              <div className="floating-tag">✿ Cosmetics</div>
            </div>
          </div>
        </section>

        {/* Wave */}
        <div className="wave-divider">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: '60px' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#fffaf9"/>
          </svg>
        </div>

        {/* ── OUR STORY ── */}
        <section className="story-section" ref={addRef(0)}>
          <div className={`fade-up ${visibleSections.has(0) ? 'visible' : ''}`}>
            <p className="section-label">Who We Are</p>
            <h2 className="section-title">
              Born from a love of <span>beautiful things</span>
            </h2>
            <p className="section-body">
              Zedify was founded with a simple but powerful idea: every woman deserves access to
              premium-quality beauty, fashion, and lifestyle products — without compromise.
            </p>
            <br />
            <p className="section-body">
              We started as a passionate team of shoppers who were tired of settling. Too many stores
              offered too little — poor quality, high prices, or no variety. So we built the store
              we always wanted: one that truly gets it.
            </p>
            <br />
            <p className="section-body">
              Today, Zedify offers everything from nourishing skin care rituals and hair care essentials
              to stunning jewellery, head-turning fashion, professional cosmetics, beautiful kitchen
              ware, and home decoration that transforms any space.
            </p>
          </div>

          <div className={`story-visual fade-up fade-up-delay-2 ${visibleSections.has(0) ? 'visible' : ''}`}>
            <div className="story-card">
              <p className="story-quote">
                "We believe that beauty is not a luxury — it is a language every woman speaks.
                Zedify exists to make sure she never runs out of words."
              </p>
              <p className="story-author">— The Zedify Team</p>
              <div className="story-accent"></div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="categories-section" ref={addRef(1)}>
          <div className={`categories-header fade-up ${visibleSections.has(1) ? 'visible' : ''}`}>
            <p className="section-label">What We Offer</p>
            <h2 className="section-title">Everything you love,<br /><span>in one place</span></h2>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <div
                key={cat.label}
                className={`category-card fade-up fade-up-delay-${Math.min(i % 4 + 1, 4)} ${visibleSections.has(1) ? 'visible' : ''}`}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-label">{cat.label}</span>
                <span className="cat-desc">{cat.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="values-section" ref={addRef(2)}>
          <div className={`values-header fade-up ${visibleSections.has(2) ? 'visible' : ''}`}>
            <p className="section-label">Our Values</p>
            <h2 className="section-title">What drives us every day</h2>
          </div>
          <div className="values-grid">
            {values.map((val, i) => (
              <div
                key={val.number}
                className={`value-item fade-up fade-up-delay-${i % 2 + 1} ${visibleSections.has(2) ? 'visible' : ''}`}
              >
                <div className="value-number">{val.number}</div>
                <div className="value-content">
                  <h3 className="value-title">{val.title}</h3>
                  <p className="value-desc">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROMISE ── */}
        <section className="promise-section" ref={addRef(3)}>
          <div className={`fade-up ${visibleSections.has(3) ? 'visible' : ''}`}>
            <div className="promise-pill">Our Promise</div>
            <h2 className="promise-title">
              Your happiness is our <em>only</em> measure of success
            </h2>
            <p className="promise-desc">
              From the moment you browse to the second your order arrives at your door,
              Zedify is committed to making every experience feel personal, easy, and delightful.
            </p>
            <div className="promise-features">
              {[
                'Free Returns', 'Secure Payments', 'Fast Delivery',
                'Authentic Products', '24/7 Support', 'Easy Exchanges'
              ].map(f => (
                <div className="feature-chip" key={f}>
                  <div className="feature-chip-dot"></div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <h2 className="cta-title">Ready to discover Zedify?</h2>
          <p className="cta-sub">Thousands of products. One beautiful store. Made for you.</p>
          <a href="/catalog" className="cta-btn">Shop Now →</a>
        </section>

      </div>
    </>
  );
};

export default AboutUs;