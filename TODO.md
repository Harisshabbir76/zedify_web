# NAVBAR LOGO → TEXT EDIT PLAN

## Information Gathered
**frontend/src/components/Navbar.js**:
- Current: `<Image src={logo} alt="Zedify" height="40px" width="auto" maxWidth="140px" />`
- Import: `import logo from '../images/logo.png';`
- Brand: Link to "/" 

## Plan
**frontend/src/components/Navbar.js**:
1. Remove `import logo from '../images/logo.png';`
2. Replace Image with styled `<span className="text-logo">LOGO</span>`
3. Add CSS: Gradient, bold, responsive sizing matching image (40px height)

```
.text-logo {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 900;
  background: linear-gradient(135deg, #fe7e8b 0%, #e65c70 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  font-family: 'Arial Black', sans-serif;
}
```

Keep all responsive/mobile behavior.

## Followup Steps
1. ✅ Edit confirmed
2. Test navbar
3. Complete

Ready for implementation.
