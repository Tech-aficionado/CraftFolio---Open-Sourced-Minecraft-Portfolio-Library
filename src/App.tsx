import { CraftfolioToggle } from "./index";

/**
 * Local demo / playground.
 *
 * This simulates an ordinary portfolio site. `CraftfolioToggle` adds a floating
 * button that flips the whole page into the Minecraft theme (using the same
 * data) and back — the library's primary "theme toggler" use case.
 */
export default function App() {
  return (
    // Wrap your normal site as children. The button switches between this
    // (normal version) and the Minecraft version. Uses built-in demo data
    // when no `data` prop is passed.
    <CraftfolioToggle persist>
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          background: "#f7f7fb",
          color: "#1a1a1a",
          padding: "64px 24px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{ fontSize: 40, margin: 0 }}>Mansha Verma</h1>
          <p style={{ fontSize: 20, color: "#555" }}>
            Software Engineer — this is a plain, ordinary portfolio page.
          </p>
          <p style={{ color: "#666", lineHeight: 1.7 }}>
            Click the <strong>“Minecraft Mode”</strong> button in the corner to
            switch this site into the Craftfolio theme, then hit “Exit” to come
            right back. Press <kbd>Esc</kbd> to exit too.
          </p>
        </div>
      </div>
    </CraftfolioToggle>
  );
}
