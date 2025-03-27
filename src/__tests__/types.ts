import { App as ObsidianApp } from 'obsidian';

export interface TestApp extends ObsidianApp {
  __commandMock: jest.Mock;
  __settingTabMock: jest.Mock;
  __noticeMock: jest.Mock;
}