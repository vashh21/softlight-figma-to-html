import axios from "axios";

const FIGMA_API_BASE = "https://api.figma.com/v1";

export class FigmaClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private get headers() {
    return {
      "X-Figma-Token": this.token
    };
  }

  async getFile(fileKey: string): Promise<any> {
    const res = await axios.get(`${FIGMA_API_BASE}/files/${fileKey}`, {
      headers: this.headers
    });
    return res.data;
  }

  async getNodes(fileKey: string, nodeIds: string[]): Promise<any> {
    const ids = nodeIds.join(",");
    const res = await axios.get(
      `${FIGMA_API_BASE}/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`,
      { headers: this.headers }
    );
    return res.data;
  }
}
