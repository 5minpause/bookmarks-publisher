import { App, PluginSettingTab, Setting } from "obsidian";
import { BookmarksPublisherSettings } from "./types";

export class BookmarksPublisherSettingTab extends PluginSettingTab {
  plugin: any;

  constructor(app: App, plugin: any) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Bookmarks Publisher Settings' });

    new Setting(containerEl)
      .setName('API Token')
      .setDesc('Your Micro.blog API token')
      .addText(text => text
        .setPlaceholder('Enter your API token')
        .setValue(this.plugin.settings.apiToken)
        .onChange(async (value) => {
          this.plugin.settings.apiToken = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Blog ID')
      .setDesc('Your Micro.blog blog ID')
      .addText(text => text
        .setPlaceholder('Enter your blog ID')
        .setValue(this.plugin.settings.blogId)
        .onChange(async (value) => {
          this.plugin.settings.blogId = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Default Tag')
      .setDesc('Default tag to use when publishing posts')
      .addText(text => text
        .setPlaceholder('Enter default tag')
        .setValue(this.plugin.settings.defaultTag)
        .onChange(async (value) => {
          this.plugin.settings.defaultTag = value;
          await this.plugin.saveSettings();
        }));
  }
}