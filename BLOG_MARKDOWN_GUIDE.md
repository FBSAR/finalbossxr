# Blog Post Markdown Guide

This guide documents the markdown syntax supported for Final Boss XR blog posts. The blog uses GitHub-flavored markdown with custom extensions for media rendering (images, videos, and audio).

## Basic Formatting

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

### Text Formatting

```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
```

### Lists

**Unordered List:**
```markdown
- Item 1
- Item 2
- Nested item
  - Sub-item 1
  - Sub-item 2
```

**Ordered List:**
```markdown
1. First item
2. Second item
3. Third item
```

### Links and Emphasis

```markdown
[Link text](https://example.com)
> This is a blockquote
> It can span multiple lines
```

### Code

**Inline code:**
```markdown
Use `const x = 10;` for inline code
```

**Code blocks:**
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

---

## Media Embedding

### Images

**Basic image:**
```markdown
![Alt text](https://example.com/image.jpg)
```

**Image with caption:**
```markdown
![Alt text | This is a caption](https://example.com/image.jpg)
```

**Image with custom height:**
```markdown
![Alt text {height=300px}](https://example.com/image.jpg)
```

**Image with caption and height:**
```markdown
![Alt text | Custom caption text {height=300px}](https://example.com/image.jpg)
```

**Supported image formats:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, etc.

---

### Videos

Videos are embedded using the same markdown syntax as images. The system automatically detects video file extensions and renders an HTML5 video player with controls.

**Basic video:**
```markdown
![Video description](https://example.com/video.mp4)
```

**Video with caption:**
```markdown
![Video description | Watch this demo {height=400px}](https://example.com/video.mp4)
```

**Video with height adjustment:**
```markdown
![Demo video {height=500px}](https://finalbossxr.s3.us-east-1.amazonaws.com/videos/demo.mp4)
```

**Supported video formats:** `.mp4`, `.webm`, `.ogg`, `.mov`, `.mkv`, `.avi`, `.flv`, `.wmv`

**Video Features:**
- Auto-plays when 50% of the video enters the viewport
- Pauses when scrolled out of view
- Includes playback controls (play/pause, timeline, volume)
- Muted by default (required for auto-play on most browsers)
- Responsive sizing

---

### Audio

Audio files are embedded using the same markdown syntax as images and videos. The system automatically detects audio file extensions and renders an HTML5 audio player.

**Basic audio:**
```markdown
![Podcast episode](https://example.com/podcast.mp3)
```

**Audio with caption:**
```markdown
![Episode 1 | Listen to our latest episode](https://example.com/episode.mp3)
```

**Supported audio formats:** `.mp3`, `.wav`, `.m4a`, `.aac`, `.flac`, `.ogg`, `.wma`, `.opus`

**Audio Features:**
- Full HTML5 audio controls (play/pause, timeline, volume)
- Styled with brand green accent color (`#00c400`)
- Responsive padding and borders
- Smooth integration with blog content
- Support for all modern browsers

**Example:**
```markdown
# Podcast Episode: Getting Started with Web Development

This episode covers the fundamentals of modern web development.

![Episode 1 - Getting Started | Full episode with timestamps](https://finalbossxr.s3.us-east-1.amazonaws.com/audio/episode-1.mp3)

In this episode, we discuss:
- Setting up your development environment
- Understanding HTML basics
- CSS for styling
```

---

## Advanced Syntax

### Figure with Caption

Both images and videos can include captions using the pipe (`|`) separator:

```markdown
![Image alt text | Caption text appears below the media](https://example.com/image.jpg)
```

This generates:
```html
<figure class="media-figure">
  <img src="..." alt="Image alt text" />
  <figcaption>Caption text appears below the media</figcaption>
</figure>
```

### Media with Size Customization

Use the `{height=XXXpx}` syntax to customize media height:

```markdown
![Alt text {height=250px}](url)
![Alt text | Caption {height=400px}](url)
```

**Note:** Height is optional. Width automatically adjusts to maintain aspect ratio.

---

## Tips and Best Practices

1. **Image Optimization:** Compress images before uploading to S3
   - Recommended sizes: 400-600KB for web (use WebP when possible)
   - Use tools like Squoosh, TinyPNG, or ImageMagick

2. **Audio Optimization:** Convert uncompressed audio to compressed formats
   - WAV to MP3: Reduce ~35MB to ~3-5MB using 128-192 kbps bitrate
   - Use FFmpeg: `ffmpeg -i audio.wav -b:a 192k audio.mp3`

3. **Alt Text:** Always provide descriptive alt text for accessibility
   ```markdown
   ![Screenshot of dashboard showing analytics metrics](url)
   ```

4. **Video Optimization:** Pre-encode videos in multiple formats if needed
   - Primary: MP4 (h.264, widely supported)
   - Fallback: WebM (smaller file size)

5. **AWS S3 URLs:** Images, videos, and audio are hosted on S3
   ```markdown
   ![Demo](https://finalbossxr.s3.us-east-1.amazonaws.com/images/demo.jpg)
   ![Video](https://finalbossxr.s3.us-east-1.amazonaws.com/videos/game-trailer.mp4)
   ![Podcast](https://finalbossxr.s3.us-east-1.amazonaws.com/audio/episode-1.mp3)
   ```

6. **Captions:** Use meaningful captions that add context
   ```markdown
   ![Feature demo | See how the new dashboard works](url)
   ![Gameplay video | 5-minute gameplay sample {height=400px}](url)
   ![Introduction | Start with our welcome audio](url)
   ```

---

## Example Blog Post

```markdown
# My First Blog Post

This is the introduction to my blog post.

## Section with Image

Here's an image demonstrating something important:

![Architecture diagram | System design overview {height=350px}](https://example.com/diagram.png)

## Section with Video

Check out this video:

![Demo video | Full product walkthrough {height=450px}](https://example.com/demo.mp4)

## Section with Audio

Listen to our podcast episode:

![Episode 1 | Introduction to web development](https://example.com/episode-1.mp3)

More text continues here...

## Summary

That's all for now!
```

---

## Supported Markdown Features

✅ **Supported:**
- Headings (h1-h4)
- Bold, italic, strikethrough
- Unordered and ordered lists
- Links
- Blockquotes
- Code blocks with syntax highlighting
- Tables
- Horizontal rules
- Custom image/video/audio with captions

❌ **Not Supported:**
- HTML tags (security)
- Task lists (checkboxes)
- Diagrams (use images instead)

---

## Troubleshooting

**Q: My audio/video isn't playing**
- A: Check the file URL is accessible and the file extension is supported
- Ensure the file is uploaded to S3 with public read permissions

**Q: Caption isn't showing**
- A: Make sure you're using the pipe (`|`) separator: `![alt | caption](url)`
- Captions only work for images, videos, and audio (detected by file extension)

**Q: Image is too large/small**
- A: Use height syntax: `![alt {height=300px}](url)`
- Width adjusts automatically to maintain aspect ratio

**Q: Audio player looks wrong**
- A: This is browser-specific. The native HTML5 controls are used for consistency
- The green accent color applies across all browsers

---

**Last Updated:** April 22, 2026
**Blog System:** Final Boss XR using SvelteKit + Marked.js
