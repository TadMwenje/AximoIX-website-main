// Creates build/privacy/index.html and build/terms/index.html so the legal pages
// have real, indexable URLs on GitHub Pages (which has no SPA rewrites).
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexHtml = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

const pages = [
  {
    route: 'privacy',
    title: 'Privacy Policy | AximoIX',
    description: 'How AximoIX collects, uses and protects your personal information, and the choices you have.'
  },
  {
    route: 'terms',
    title: 'Terms of Service | AximoIX',
    description: 'The terms for using the AximoIX website and services, including our rules on copying our software and security testing.'
  }
];

const replaceOnce = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) {
    throw new Error(`postbuild: could not find ${label} in build/index.html`);
  }
  return html.replace(pattern, replacement);
};

for (const page of pages) {
  const url = `https://aximoix.com/${page.route}/`;
  let html = indexHtml;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${page.title}</title>`, 'title');
  html = replaceOnce(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${page.description}"/>`, 'description');
  html = replaceOnce(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}"/>`, 'canonical');
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}"/>`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${page.title}"/>`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${page.description}"/>`);
  // The homepage's structured data and no-JS content describe the homepage, not these pages
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
  html = html.replace(/<noscript>\s*<div[\s\S]*?<\/noscript>/, `<noscript><p style="padding:40px;color:#e0e0e0;background:#0a0a0a">Please enable JavaScript to read this page, or email <a href="mailto:hello@aximoix.com" style="color:#00FFD1">hello@aximoix.com</a> for a copy.</p></noscript>`);

  const outDir = path.join(buildDir, page.route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`postbuild: wrote ${page.route}/index.html`);
}
