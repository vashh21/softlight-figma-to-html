import { INode } from "./types";

function classNameFor(node: INode): string {
  return `n-${node.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function bgFor(node: INode): string {
  if (node.type === "text") return "";

  if (!node.fills || node.fills.length === 0) return "";
  const f = node.fills[0];

  if (f.type === "SOLID" && f.color) {
    return `background: ${f.color};`;
  }

  if (f.type === "GRADIENT_LINEAR" && f.gradientStops) {
    const stops = f.gradientStops
      .map((s) => `${s.color} ${Math.round(s.position * 100)}%`)
      .join(", ");

    const angle = f.gradientAngleDeg ?? 180; 
    return `background: linear-gradient(${angle}deg, ${stops});`;
  }

  return "";
}

function textStyles(node: INode): string {
  if (!node.textStyle) return "";
  const s = node.textStyle;
  const parts: string[] = [];

  if (s.fontFamily) parts.push(`font-family: "${s.fontFamily}", sans-serif;`);
  if (s.fontSize) parts.push(`font-size: ${s.fontSize}px;`);
  if (s.fontWeight) parts.push(`font-weight: ${s.fontWeight};`);
  if (s.lineHeightPx) parts.push(`line-height: ${s.lineHeightPx}px;`);
  if (s.letterSpacing)
    parts.push(`letter-spacing: ${s.letterSpacing}px;`);
  if (s.color) parts.push(`color: ${s.color};`);
  if (s.textAlignHorizontal)
    parts.push(`text-align: ${s.textAlignHorizontal.toLowerCase()};`);

  return parts.join("\n  ");
}

function borderStyles(node: INode): string {
  const parts: string[] = [];
  if (node.strokeColor && node.strokeWidth != null) {
    parts.push(
      `border: ${node.strokeWidth}px solid ${node.strokeColor};`
    );
  }
  if (node.cornerRadius != null) {
    if (typeof node.cornerRadius === "number") {
      parts.push(`border-radius: ${node.cornerRadius}px;`);
    } else if (Array.isArray(node.cornerRadius)) {
      const [tl, tr, br, bl] = node.cornerRadius;
      parts.push(`border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`);
    }
  }
  return parts.join("\n  ");
}

function effectsStyles(node: INode): string {
  if (!node.effects || !node.effects.length) return "";
  const dropShadows = node.effects
    .filter((e: any) => e.type === "DROP_SHADOW" && e.visible !== false)
    .map((e: any) => {
      const color = e.color;
      const c = `rgba(${Math.round(color.r * 255)}, ${Math.round(
        color.g * 255
      )}, ${Math.round(color.b * 255)}, ${color.a})`;
      return `${e.offset.x}px ${e.offset.y}px ${e.radius}px ${c}`;
    });
  if (!dropShadows.length) return "";
  return `box-shadow: ${dropShadows.join(", ")};`;
}

function nodeCss(node: INode): string {
  const className = classNameFor(node);
  const { x, y, width, height } = node.layout;

  const rules: string[] = [
    `position: absolute;`,
    `left: ${x}px;`,
    `top: ${y}px;`,
    `width: ${width}px;`,
    `height: ${height}px;`
  ];

  const bg = bgFor(node);
  if (bg) rules.push(bg);

  const borders = borderStyles(node);
  if (borders) rules.push(borders);

  const effects = effectsStyles(node);
  if (effects) rules.push(effects);

  const text = textStyles(node);
  if (text) rules.push(text);

  if (node.type !== "text") {
    rules.push(`box-sizing: border-box;`);
  }

  if (node.clipsContent) {
    rules.push(`overflow: hidden;`);
  }

  return `.${className} {
  ${rules.join("\n  ")}
}
`;
}

export function renderCss(root: INode): string {
  const pieces: string[] = [
    `* { margin: 0; padding: 0; }`,
    `body { display:flex; justify-content:center; align-items:center; min-height:100vh; background:#000; }`,
    `.root { overflow:hidden; }`
  ];

  const stack: INode[] = [root];

  while (stack.length) {
    const node = stack.pop()!;
    if (node !== root && node.visible !== false) {
      pieces.push(nodeCss(node));
    }
    for (const child of node.children) {
      stack.push(child);
    }
  }

  return pieces.join("\n");
}
