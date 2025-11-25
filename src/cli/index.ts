#!/usr/bin/env node
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FigmaClient } from "../api/figmaClient";
import { normalizeNode } from "../core/normalize";
import { renderHtml } from "../core/htmlGenerator";
import { renderCss } from "../core/cssGenerator";

const argv = yargs(hideBin(process.argv))
  .option("file-key", { type: "string", demandOption: true })
  .option("node-id", { type: "string", demandOption: false })
  .option("out", { type: "string", default: "dist/softlight" })
  .help()
  .parseSync();

async function main() {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    console.error("FIGMA_TOKEN env var is required");
    process.exit(1);
  }

  const fileKey = argv["file-key"];
  const nodeId = argv["node-id"];
  const outDir = argv["out"];

  const client = new FigmaClient(token);
  const file = await client.getFile(fileKey);

  let targetNode: any;

  if (nodeId) {
    const nodesResp = await client.getNodes(fileKey, [nodeId]);
    const nodeWrapper = nodesResp.nodes[nodeId];
    if (!nodeWrapper || !nodeWrapper.document) {
      console.error(`Could not find node with id ${nodeId}`);
      process.exit(1);
    }
    targetNode = nodeWrapper.document;
  } else {
    const firstPage = file.document.children[0];
    targetNode = firstPage.children.find((c: any) => c.type === "FRAME");
    if (!targetNode) {
      console.error("Could not find a FRAME on the first page. Pass --node-id.");
      process.exit(1);
    }
  }

  const root = normalizeNode(targetNode);
  const html = renderHtml(root);
  const css = renderCss(root);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
  fs.writeFileSync(path.join(outDir, "styles.css"), css, "utf8");

  console.log(`Generated HTML/CSS at ${outDir}/index.html`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
