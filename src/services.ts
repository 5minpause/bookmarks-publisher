import { Notice } from "obsidian";
import { BookmarksPublisherSettings } from "./types";

export class MicroBlogService {
  constructor(private settings: BookmarksPublisherSettings) {}

  async publishPost(content: string, tags: string[], blogId: string): Promise<boolean> {
    if (!this.settings.apiToken) {
      new Notice("Micro.blog API token not configured");
      return false;
    }

    try {
      console.log('Sending to Micro.blog:', { content, tags, blogId }); // Debug log

      const response = await fetch("https://micro.blog/micropub", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.settings.apiToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "h": "entry",
          "content": content,
          ...tags.reduce((acc, tag) => ({ ...acc, [`category[]`]: tag }), {}),
          "mp-destination": blogId
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error sending to Micro.blog:", error);
      return false;
    }
  }
}