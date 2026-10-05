/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#18221F',
    tint: '#678C38',

    // Core surfaces
    background: '#F0F2E9',
    foreground: '#18221F',

    // Cards / elevated surfaces
    card: '#FAFBF6',
    cardForeground: '#18221F',

    // Primary action color (buttons, links, active states)
    primary: '#A8E66A',
    primaryForeground: '#142016',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E4E9DC',
    secondaryForeground: '#29352D',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#E7EADF',
    mutedForeground: '#68746D',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#FCE0D8',
    accentForeground: '#9E4C39',

    // Destructive actions (delete, error states)
    destructive: '#C94235',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#DCE1D5',
    input: '#DCE1D5',
  },
  dark: {
    text: '#F2F4EC',
    tint: '#A8E66A',
    background: '#0B1115',
    foreground: '#F2F4EC',
    card: '#131C21',
    cardForeground: '#F2F4EC',
    primary: '#A8E66A',
    primaryForeground: '#142016',
    secondary: '#1C292F',
    secondaryForeground: '#DDE5DC',
    muted: '#172329',
    mutedForeground: '#99A7A5',
    accent: '#382621',
    accentForeground: '#FF9B7D',
    destructive: '#E46758',
    destructiveForeground: '#FFFFFF',
    border: '#29363B',
    input: '#29363B',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
