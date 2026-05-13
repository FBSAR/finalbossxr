const { marked } = require('marked');

const renderer = new marked.Renderer();

renderer.image = (token) => {
  const { href, title, text } = token;
  let altText = text || '';
  let caption = '';
  let heightAttr = '';

  const heightMatch = text?.match(/\{height=([^}]+)\}/);
  if (heightMatch) heightAttr = ` height="${heightMatch[1]}"`;

  const pipeIndex = text?.indexOf('|') ?? -1;
  if (pipeIndex !== -1 && text) {
    altText = text.substring(0, pipeIndex).trim();
    caption = text.substring(pipeIndex + 1).trim();
    if (heightMatch) caption = caption.replace(/\s*\{height=[^}]+\}/, '').trim();
  } else if (heightMatch && text) {
    altText = text.replace(/\s*\{height=[^}]+\}/, '').trim();
  }

  const titleAttr = title ? ` title="${title}"` : '';
  const img = `<img src="${href}" alt="${altText}"${titleAttr}${heightAttr} style="display:block; max-width:100%; height:auto; border:none; outline:none; text-decoration:none;" />`;
  
  if (caption) {
    return `<div style="margin: 16px 0; text-align:center;">${img}<div style="font-size:13px; color:#888; margin-top:8px;">${caption}</div></div>`;
  }
  return `<div style="margin: 16px 0;">${img}</div>`;
};

marked.setOptions({ gfm: true, breaks: true, renderer });

const md = `[Read Aaron's Full Feature](https://finalbossxr.com/blog/draft/teammate-highlight-aaron)

![Aaron Goodson](https://finalbossxr.s3.us-east-1.amazonaws.com/team-photos/Aaron_Pro_Pic.jpg)`;

console.log('=== OUTPUT ===');
console.log(marked(md));
