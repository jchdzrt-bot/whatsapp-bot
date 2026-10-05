/**
 * Design tokens that mirror the CSS custom properties referenced by the
 * dashboard mockups (notes/design/*.html).
 *
 * Values are hardcoded for now because no global MUI theme is configured yet.
 * When the app grows a real theme, these can be mapped to palette entries.
 */
export const tokens = {
  radius: {
    card: 12,
    inner: 10,
    chip: 6,
  },
  color: {
    surface1: "#ffffff",
    surface2: "#f7f8fa",
    surface3: "#eef1f4",
    borderSoft: "rgba(13, 23, 42, 0.08)",
    border: "rgba(13, 23, 42, 0.12)",
    borderStrong: "rgba(13, 23, 42, 0.24)",
    text: "#161b26",
    textSecondary: "#5c6470",
    textMuted: "#8d94a3",
    accent: "#7c5ad6",
    accentText: "#6d4dc4",
    accentMutedBg: "rgba(124, 90, 214, 0.1)",
    accentSolid: "#7c5ad6",
    fillSecondary: "#eef0f4",
    fillSecondaryHover: "#e3e6ec",
    successBg: "rgba(46, 160, 67, 0.1)",
    successText: "#1a7f37",
    dangerText: "#c92936",
    tintVioletBg: "rgba(124, 90, 214, 0.12)",
    tintVioletText: "#6d4dc4",
    tintAquaBg: "rgba(18, 148, 166, 0.12)",
    tintAquaText: "#0f8797",
    tintCoralBg: "rgba(225, 106, 73, 0.12)",
    tintCoralText: "#c9553b",
    tintMintBg: "rgba(18, 150, 84, 0.12)",
    tintMintText: "#0f8a4d",
  },
} as const;
export const breakpoints = {
  /**
   * Phones / compact viewports: the calendar collapses to a single day and the
   * chat section shows either the list or the open thread (WhatsApp-style).
   */
  mobileMax: "767.98px",
} as const;