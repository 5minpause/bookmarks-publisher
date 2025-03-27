import { App, Modal } from "obsidian";

export class CommentaryModal extends Modal {
  private commentary: string = '';
  private resolvePromise: (value: string) => void;

  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: 'Add Commentary' });
    contentEl.createEl('p', { text: 'Add your commentary below (Markdown supported):' });

    const textArea = contentEl.createEl('textarea', { attr: { rows: '5' } });
    textArea.style.width = '100%';
    textArea.style.marginBottom = '1em';

    const buttonContainer = contentEl.createEl('div', { cls: 'modal-button-container' });
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '1em';

    const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
    const submitButton = buttonContainer.createEl('button', { text: 'Publish' });

    cancelButton.onclick = () => {
      this.commentary = '';
      this.close();
    };

    submitButton.onclick = () => {
      this.commentary = textArea.value;
      this.close();
    };
  }

  onClose() {
    if (this.resolvePromise) {
      this.resolvePromise(this.commentary);
    }
  }

  async getCommentary(): Promise<string> {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
    });
  }
}