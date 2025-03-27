import { App } from 'obsidian';
import { MicroBlogService } from '../services';
import { BookmarksPublisherSettings } from '../types';
import { TestApp } from './types';

describe('MicroBlogService', () => {
  let service: MicroBlogService;
  let app: TestApp;
  let settings: BookmarksPublisherSettings;

  beforeEach(() => {
    app = new App() as TestApp;
    (global as any).app = app;
    settings = {
      apiToken: 'test-token',
      blogId: 'test-blog',
      defaultTag: 'test-tag'
    };
    service = new MicroBlogService(settings);

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response)
    );
  });

  afterEach(() => {
    delete (global as any).app;
  });

  test('should publish post successfully', async () => {
    const content = 'Test content';
    const tags = ['tag1', 'tag2'];
    const blogId = 'test-blog';

    const success = await service.publishPost(content, tags, blogId);

    expect(success).toBe(true);
    expect(fetch).toHaveBeenCalledWith('https://micro.blog/micropub', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.apiToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: expect.any(String),
    });
  });

  test('should handle missing API token', async () => {
    service = new MicroBlogService({} as BookmarksPublisherSettings);
    const success = await service.publishPost('content', [], 'blog');
    expect(success).toBe(false);
  });

  test('should handle API error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
      } as Response)
    );

    const success = await service.publishPost('content', [], 'blog');
    expect(success).toBe(false);
  });
});