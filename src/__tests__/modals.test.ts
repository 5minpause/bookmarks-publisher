import { App } from 'obsidian';
import { CommentaryModal } from '../modals';

describe('CommentaryModal', () => {
  let app: App;
  let modal: CommentaryModal;

  beforeEach(() => {
    app = new App();
    modal = new CommentaryModal(app);
  });

  test('should resolve with empty string when cancelled', async () => {
    const commentaryPromise = modal.getCommentary();
    modal.onClose();
    const commentary = await commentaryPromise;
    expect(commentary).toBe('');
  });

  test('should resolve with commentary when submitted', async () => {
    const testCommentary = 'Test commentary';
    const commentaryPromise = modal.getCommentary();

    // Simulate setting the commentary and submitting
    (modal as any).commentary = testCommentary;
    modal.onClose();

    const commentary = await commentaryPromise;
    expect(commentary).toBe(testCommentary);
  });
});