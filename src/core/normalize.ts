import { IFillStyle, INode, ITextStyle } from "./types";

function figmaColorToRgba(c: any, opacity?: number): string {
  const r = Math.round((c?.r ?? 0) * 255);
  const g = Math.round((c?.g ?? 0) * 255);
  const b = Math.round((c?.b ?? 0) * 255);
  const a = opacity != null ? opacity : c?.a ?? 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function computeGradientAngleDeg(fill: any): number | undefined {
  const handles = fill.gradientHandlePositions;
  if (!handles || handles.length < 2) return undefined;

  const p0 = handles[0];
  const p1 = handles[1];
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;

  if (dx === 0 && dy === 0) return undefined;

  const rad = Math.atan2(dy, dx);
  let deg = (rad * 180) / Math.PI;

  deg = (deg + 90 + 360) % 360;
  return deg;
}

function normalizeFills(fills: any[] | undefined): IFillStyle[] | undefined {
  if (!fills) return undefined;
  const visibleFills = fills.filter((f) => f.visible !== false);
  if (!visibleFills.length) return undefined;

  return visibleFills.map((f: any) => {
    if (f.type === "SOLID") {
      return {
        type: "SOLID",
        color: figmaColorToRgba(f.color, f.opacity)
      };
    }

    if (f.type === "GRADIENT_LINEAR") {
      const angleDeg = computeGradientAngleDeg(f);
      return {
        type: "GRADIENT_LINEAR",
        gradientStops: (f.gradientStops || []).map((s: any) => ({
          position: s.position,
          color: figmaColorToRgba(s.color)
        })),
        gradientAngleDeg: angleDeg
      };
    }

    return { type: f.type };
  });
}

function normalizeTextStyle(node: any): ITextStyle | undefined {
  if (!node.style) return undefined;
  const s = node.style;
  let color: string | undefined;

  if (node.fills && node.fills[0] && node.fills[0].type === "SOLID") {
    color = figmaColorToRgba(node.fills[0].color, node.fills[0].opacity);
  }

  return {
    fontFamily: s.fontFamily,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    lineHeightPx: s.lineHeightPx,
    letterSpacing: s.letterSpacing,
    textAlignHorizontal: s.textAlignHorizontal,
    textAlignVertical: s.textAlignVertical,
    color
  };
}

function mapNodeType(figmaType: string): INode["type"] {
  switch (figmaType) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return "frame";
    case "GROUP":
      return "group";
    case "RECTANGLE":
      return "rect";
    case "TEXT":
      return "text";
    default:
      return "vector";
  }
}

interface AbsBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Each node's layout (x, y) is relative to its parent.
 */
export function normalizeNode(node: any, parentAbs?: AbsBox): INode {
  const nodeType = mapNodeType(node.type);
  const abs: AbsBox = node.absoluteBoundingBox || {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  const origin: AbsBox = parentAbs ?? abs;

  const x = (abs.x ?? 0) - (origin.x ?? 0);
  const y = (abs.y ?? 0) - (origin.y ?? 0);
  const width = abs.width ?? 0;
  const height = abs.height ?? 0;

  const fills = normalizeFills(node.fills);
  const textStyle = nodeType === "text" ? normalizeTextStyle(node) : undefined;

  const childrenRaw = node.children || [];
  const children = childrenRaw.map((c: any) => normalizeNode(c, abs));

  return {
    id: node.id,
    type: nodeType,
    name: node.name,
    layout: { x, y, width, height },
    children,
    textContent: nodeType === "text" ? node.characters : undefined,
    textStyle,
    fills,
    strokeColor:
      node.strokes && node.strokes[0]
        ? figmaColorToRgba(
            node.strokes[0].color,
            node.strokes[0].opacity ?? 1
          )
        : undefined,
    strokeWidth: node.strokeWeight,
    cornerRadius: node.cornerRadius,
    effects: node.effects,
    visible: node.visible !== false,
    clipsContent: node.clipsContent === true
  };
}
