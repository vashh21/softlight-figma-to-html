import { INode } from "./types";

function classNameFor(node: INode): string {
  return `n-${node.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function tagFor(node: INode): string {
  if (node.type === "text") return "p";
  return "div";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderNode(node: INode): string {
  if (node.visible === false) return "";

  const tag = tagFor(node);
  const className = classNameFor(node);
  const childrenHtml = node.children.map(renderNode).join("");

  if (node.type === "text") {
    const text = node.textContent || "";
    return `<${tag} class="${className}">${escapeHtml(text)}</${tag}>`;
  }

  return `<${tag} class="${className}">${childrenHtml}</${tag}>`;
}

export function renderHtml(root: INode, cssFileName = "styles.css"): string {
  const rootWidth = root.layout.width || 1440;
  const rootHeight = root.layout.height || 900;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${root.name}</title>
  <link rel="stylesheet" href="${cssFileName}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <div class="root" style="position:relative;width:${rootWidth}px;height:${rootHeight}px;">
    ${root.children.map(renderNode).join("")}
  </div>
</body>
</html>`;
}
