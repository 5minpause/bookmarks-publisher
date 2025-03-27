export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  minAppVersion: string;
  author: string;
  description: string;
}

// Shared storage for plugin data
const pluginStorage = new Map<string, any>();

interface Command {
  id: string;
  name: string;
  callback: () => any;
}

declare module 'obsidian' {
  interface App {
    addCommand(command: Command): void;
    addSettingTab(tab: PluginSettingTab): void;
  }
}

export class App {
  workspace = {
    getActiveFile: jest.fn(),
  };
  metadataCache = {
    getFileCache: jest.fn(),
  };
  vault = {
    read: jest.fn(),
  };

  private commandFn = jest.fn();
  private settingTabFn = jest.fn();
  private noticeFn = jest.fn();

  addCommand(command: Command): void {
    this.commandFn(command);
  }

  addSettingTab(tab: PluginSettingTab): void {
    this.settingTabFn(tab);
  }

  // For testing
  get __commandMock() {
    return this.commandFn;
  }

  get __settingTabMock() {
    return this.settingTabFn;
  }

  get __noticeMock() {
    return this.noticeFn;
  }
}

export class Plugin {
  app: App;
  settings: any;
  manifest: PluginManifest;

  constructor(app: App, manifest: PluginManifest) {
    this.app = app;
    this.manifest = manifest;
  }

  async loadData() {
    return pluginStorage.get(this.manifest.id) || {};
  }

  async saveData(data: any) {
    pluginStorage.set(this.manifest.id, data);
  }

  addCommand(command: Command) {
    this.app.addCommand(command);
  }

  addSettingTab(tab: PluginSettingTab) {
    this.app.addSettingTab(tab);
  }

  async onload() {}
  async onunload() {}
}

export class PluginSettingTab {
  app: App;
  plugin: Plugin;

  constructor(app: App, plugin: Plugin) {
    this.app = app;
    this.plugin = plugin;
  }

  display() {}
}

export class Modal {
  app: App;

  constructor(app: App) {
    this.app = app;
  }

  open() {}
  close() {}
}

export class Notice {
  message: string;

  constructor(message: string) {
    this.message = message;
    // Get the global app instance from the window object
    const app = (global as any).app;
    if (app && app.__noticeMock) {
      app.__noticeMock(message);
    }
  }
}

export class Setting {
  containerEl: HTMLElement;

  constructor(containerEl: HTMLElement) {
    this.containerEl = containerEl;
  }

  setName(name: string) {
    return this;
  }

  setDesc(desc: string) {
    return this;
  }

  addText(callback: (text: any) => void) {
    return this;
  }
}