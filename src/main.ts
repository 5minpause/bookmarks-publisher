import { App, Notice, TFile, Plugin } from "obsidian";
import { NoteMetadata, BookmarksPublisherSettings } from "./types";
import { CommentaryModal } from "./modals";
import { BookmarksPublisherSettingTab } from "./settings";
import { MicroBlogService } from "./services";

export class BookmarksPublisher extends Plugin {
  settings: BookmarksPublisherSettings;
  private microBlogService: MicroBlogService;

  async onload() {
    await this.loadSettings();
    this.microBlogService = new MicroBlogService(this.settings);
    this.addSettingTab(new BookmarksPublisherSettingTab(this.app, this));

    this.addCommand({
      id: "publish-note",
      name: "Publish Note to Micro.blog",
      callback: () => this.publishNote(),
    });
  }

  async onunload() {
    // Cleanup if needed
  }

  async loadSettings() {
    this.settings = Object.assign({}, {
      apiToken: "",
      blogId: "",
      defaultTag: "obsidian"
    }, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async publishNote() {
    try {
      const noteMetadata = await this.getActiveNoteMetadata();
      if (!noteMetadata) {
        new Notice("No active note found.");
        return;
      }

      // Open commentary modal and wait for it to close
      const commentaryModal = new CommentaryModal(this.app);
      commentaryModal.open();
      const commentary = await commentaryModal.getCommentary();

      // Get all tags (excluding 'clippings')
      const tags = [...noteMetadata.tags.filter(tag => tag !== 'clippings'), this.settings.defaultTag];

      // Prepare content
      const content = this.preparePostContent(noteMetadata, commentary, tags);

      console.log('Post content:', content); // Debug log

      const success = await this.microBlogService.publishPost(
        content,
        tags,
        this.settings.blogId
      );

      new Notice(success ? "Note published!" : "Failed to publish note.");
    } catch (error) {
      console.error('Error in publishNote:', error);
      new Notice(`Error publishing note: ${error.message}`);
    }
  }

  private preparePostContent(metadata: NoteMetadata, commentary: string, tags: string[]): string {
    let content = `# ${metadata.title}\n\n`;
    content += `Source: ${metadata.source}\n\n`;

    if (commentary && commentary.trim()) {
      content += `${commentary.trim()}\n\n`;
    }

    // Add tags to the content, excluding 'bookmark'
    const displayTags = tags.filter(tag => tag !== 'bookmark');
    if (displayTags && displayTags.length > 0) {
      content += `Tags: ${displayTags.join(', ')}\n`;
    }

    return content.trim();
  }

  async getActiveNoteMetadata(): Promise<NoteMetadata | null> {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) return null;

    try {
      const fileContent = await this.app.vault.read(activeFile);
      const frontmatter = this.app.metadataCache.getFileCache(activeFile)?.frontmatter;

      if (!frontmatter) {
        throw new Error("No frontmatter found in note");
      }

      // Get tags from frontmatter and file content
      const frontmatterTags = frontmatter.tags || [];
      const fileTags = this.app.metadataCache.getFileCache(activeFile)?.tags || [];
      const allTags = [...new Set([...frontmatterTags, ...fileTags.map(t => t.tag)])];

      console.log('Collected tags:', allTags); // Debug log

      return {
        title: frontmatter.title || activeFile.basename,
        source: frontmatter.source || '',
        tags: allTags
      };
    } catch (error) {
      console.error("Error reading file:", error);
      return null;
    }
  }
}