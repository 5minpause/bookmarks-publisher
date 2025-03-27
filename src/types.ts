export interface BookmarksPublisherSettings {
  apiToken: string;
  blogId: string;
  defaultTag: string;
}

export interface NoteMetadata {
  title: string;
  source: string;
  tags: string[];
}

export interface Command {
  id: string;
  name: string;
  callback: () => any;
}