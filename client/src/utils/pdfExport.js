const oklchToRgb = (match, lightness, chroma, hue, alpha) => {
  const L = lightness.endsWith("%")
    ? Number.parseFloat(lightness) / 100
    : Number.parseFloat(lightness);
  const C = Number.parseFloat(chroma);
  let H = Number.parseFloat(hue);
  if (hue.endsWith("turn")) H *= 360;
  else if (hue.endsWith("rad")) H = (H * 180) / Math.PI;
  else if (hue.endsWith("grad")) H *= 0.9;

  const radians = (H * Math.PI) / 180;
  const a = C * Math.cos(radians);
  const b = C * Math.sin(radians);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const channels = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((linear) => {
    const clamped = Math.max(0, Math.min(1, linear));
    const encoded = clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * clamped ** (1 / 2.4) - 0.055;
    return Math.round(encoded * 255);
  });
  const normalizedAlpha = alpha
    ? (alpha.trim().endsWith("%")
      ? Number.parseFloat(alpha) / 100
      : Number.parseFloat(alpha))
    : null;
  return normalizedAlpha === null
    ? `rgb(${channels.join(", ")})`
    : `rgba(${channels.join(", ")}, ${normalizedAlpha})`;
};

const replaceOklch = (value) => value.replace(
  /oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg|rad|turn|grad)?)\s*(?:\/\s*([\d.]+%?))?\s*\)/gi,
  oklchToRgb
);

const normalizeUnsupportedColors = (rootElement) => {
  const nodes = [rootElement, ...rootElement.querySelectorAll("*")];

  nodes.forEach((node) => {
    const computed = window.getComputedStyle(node);
    for (let index = 0; index < computed.length; index += 1) {
      const property = computed[index];
      const value = computed.getPropertyValue(property);
      if (value.includes("oklch(")) {
        node.style.setProperty(property, replaceOklch(value));
      }
    }
  });
};

const normalizeContactAlignment = (rootElement) => {
  const list = rootElement.querySelector(".resume-contact-list");
  if (!list) return;

  list.style.setProperty("display", "block", "important");
  list.style.setProperty("text-align", "center", "important");
  list.style.setProperty("line-height", "1.5", "important");

  rootElement.querySelectorAll(".resume-contact-item").forEach((item) => {
    item.style.setProperty("display", "inline-flex", "important");
    item.style.setProperty("align-items", "center", "important");
    item.style.setProperty("vertical-align", "middle", "important");
    item.style.setProperty("white-space", "nowrap", "important");
    item.style.setProperty("height", "18px", "important");
    item.style.setProperty("line-height", "18px", "important");
    item.style.setProperty("margin", "0 8px 4px", "important");

    const icon = item.querySelector("svg");
    if (icon) {
      icon.style.setProperty("display", "inline-block", "important");
      icon.style.setProperty("width", "14px", "important");
      icon.style.setProperty("height", "14px", "important");
      // Nudge SVG artwork down to align optically with the text glyphs.
      icon.style.setProperty("position", "relative", "important");
      icon.style.setProperty("top", "2px", "important");
      if (icon.classList.contains("resume-contact-icon-email")) {
        // Lucide's mail outline occupies less of its 24px viewBox vertically.
        icon.style.setProperty("transform", "scaleY(1.2)", "important");
        icon.style.setProperty("transform-origin", "center", "important");
      }
    }

    const label = item.querySelector(".resume-contact-text");
    if (label) {
      label.style.setProperty("display", "block", "important");
      label.style.setProperty("line-height", "16px", "important");
    }
  });
};

/**
 * Prepare a cloned resume for html2pdf without removing its Tailwind classes.
 * The classes provide most of the resume's layout and typography; computed
 * styles cannot be copied reliably through CSSStyleDeclaration.cssText.
 */
export const preparePdfExport = (rootElement) => {
  rootElement.classList.add("resume-pdf-export");
  rootElement.style.setProperty("width", "210mm");
  rootElement.style.setProperty("min-width", "210mm");
  rootElement.style.setProperty("max-width", "210mm");
  rootElement.style.setProperty("background", "#ffffff");
  rootElement.style.setProperty("box-shadow", "none");
  rootElement.style.setProperty("transform", "none");
  rootElement.style.setProperty("zoom", "1");
  normalizeUnsupportedColors(rootElement);
  normalizeContactAlignment(rootElement);

  return rootElement;
};
