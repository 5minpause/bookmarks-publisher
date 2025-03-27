# Bookmarks Publisher for Micro.blog

This Obsidian plugin allows you to publish bookmarked content to your Micro.blog account. It's designed to work with notes created by the [Obsidian Web Clipper](https://obsidian.md/clipper) plugin, which automatically adds the `clippings` tag to saved content.

**Author:** Holger Frohloff

## Features

- Publish bookmarked content to Micro.blog with title and source from frontmatter
- Add custom commentary to your posts
- Automatically includes note tags as Micro.blog categories
- Supports markdown formatting in commentary
- Configurable default tag for all posts

## Installation

1. Open Obsidian Settings
2. Go to Community Plugins
3. Disable Safe Mode (if enabled)
4. Click Browse and search for "Bookmarks Publisher for Micro.blog"
5. Click Install, then Enable

## Configuration

1. Go to Settings > Community Plugins > Bookmarks Publisher for Micro.blog
2. Configure the following settings:
   - **API Token**: Your Micro.blog API token (get it from [Micro.blog](https://micro.blog/account/api))
   - **Blog ID**: Your Micro.blog blog ID
   - **Default Tag**: A default tag to be added to all posts (defaults to "obsidian")

## Usage

1. Use the [Obsidian Web Clipper](https://obsidian.md/clipper) to save web content to your vault. The clipper will automatically add the `clippings` tag.

2. To publish a note:
   - Open the note you want to publish
   - Use the command palette (Cmd/Ctrl + P)
   - Search for "Publish Note to Micro.blog"
   - Add your commentary in the popup window
   - Click Publish

## Notes

- The plugin will automatically:
  - Include the note's title and source in the post
  - Add your commentary (if provided)
  - Include all tags from the note (except "clippings")
  - Add the configured default tag
  - Show all tags (except "bookmark") in the post body

## Requirements

- Obsidian v0.15.0 or higher
- A Micro.blog account
- Micro.blog API token
- [Obsidian Web Clipper](https://obsidian.md/clipper) plugin (recommended)

## Support

If you encounter any issues or have suggestions, please open an issue on the GitHub repository.