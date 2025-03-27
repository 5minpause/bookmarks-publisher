import { App, PluginManifest } from 'obsidian';
import { BookmarksPublisher } from '../main';
import { TestApp } from './types';

const mockManifest: PluginManifest = {
  id: 'test-plugin',
  name: 'Test Plugin',
  version: '1.0.0',
  minAppVersion: '0.15.0',
  author: 'Test Author',
  description: 'Test Description'
};

describe('BookmarksPublisher', () => {
  let app: TestApp;
  let plugin: BookmarksPublisher;

  beforeEach(() => {
    app = new App() as TestApp;
    (global as any).app = app;
    plugin = new BookmarksPublisher(app, mockManifest);
  });

  afterEach(() => {
    delete (global as any).app;
  });

  test('should initialize with default settings', async () => {
    await plugin.loadSettings();
    expect(plugin.settings).toEqual({
      apiToken: '',
      blogId: '',
      defaultTag: 'obsidian'
    });
  });

  test('should save and load settings', async () => {
    const testSettings = {
      apiToken: 'test-token',
      blogId: 'test-blog',
      defaultTag: 'test-tag'
    };

    plugin.settings = testSettings;
    await plugin.saveSettings();

    const newPlugin = new BookmarksPublisher(app, mockManifest);
    await newPlugin.loadSettings();

    expect(newPlugin.settings).toEqual(testSettings);
  });

  test('should add command on load', async () => {
    await plugin.onload();
    expect(app.__commandMock).toHaveBeenCalledWith({
      id: 'publish-note',
      name: 'Publish Note to Micro.blog',
      callback: expect.any(Function)
    });
  });

  test('should add setting tab on load', async () => {
    await plugin.onload();
    expect(app.__settingTabMock).toHaveBeenCalled();
  });

  test('should handle publish note command', async () => {
    await plugin.onload();
    const command = app.__commandMock.mock.calls[0][0];
    await command.callback();
    expect(app.__noticeMock).toHaveBeenCalledWith('No active note found.');
  });
});