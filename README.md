# Jose Aristizabal - Portfolio & Blog

Personal portfolio and technical blog showcasing Microsoft Dynamics 365, Power Platform, and Azure expertise.

## 🚀 Quick Start with Jekyll

### Prerequisites

1. Install Ruby (version 2.7 or higher)
2. Install Bundler: `gem install bundler`

### Local Development

```bash
# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# Access at http://localhost:4000
```

### Build for Production

```bash
bundle exec jekyll build
```

## 📁 Project Structure

```
/
├── _config.yml              # Jekyll configuration
├── _layouts/
│   ├── default.html         # Base layout
│   ├── post.html           # Blog post layout
├── _includes/
│   ├── header.html         # Site header
│   ├── footer.html         # Site footer
│   └── blog-card.html      # Blog card component
├── _posts/                 # Blog posts (Markdown)
│   ├── 2025-01-15-power-platform-architecture-patterns.md
│   ├── 2025-01-20-multi-tier-case-routing-dynamics-365.md
│   └── 2025-01-25-azure-ai-document-intelligence-power-platform.md
├── blog/
│   └── index.html          # Blog main page
├── assets/
│   ├── images/
│   └── documents/
├── components/             # Legacy JS components (deprecated, use _includes instead)
├── index.html              # Homepage
├── projects.html           # Projects page
├── contact.html            # Contact page
└── Gemfile                 # Ruby dependencies
```

## ✍️ Creating a New Blog Post

### Step 1: Create Markdown File

Create a file in `_posts/` with format: `YYYY-MM-DD-title-slug.md`

Example: `_posts/2025-02-01-my-new-post.md`

### Step 2: Add Front Matter

```markdown
---
layout: post
title: "Your Post Title Here"
date: 2025-02-01
categories: [Power Platform, Dynamics 365]
tags: [power-apps, automation, best-practices]
excerpt: "Brief description of your post (160 characters max for SEO)"
author: Jose Aristizabal
image: /assets/images/blog/my-post-cover.jpg
read_time: 8
---

## Introduction

Your content here in Markdown...

## Section 1

More content...
```

### Step 3: Write Content in Markdown

Use standard Markdown syntax:

```markdown
# H1 Heading
## H2 Heading
### H3 Heading

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item

[Link text](https://example.com)

![Image alt](path/to/image.jpg)

```code
Code block
```
```

### Step 4: Preview Locally

```bash
bundle exec jekyll serve
# Visit http://localhost:4000/blog
```

## 🎨 Customization

### Colors

Edit in `_layouts/default.html`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "primary": "#0078D4",        // Main brand color
        "accent-green": "#107C10",   // Success/accent color
        ...
      }
    }
  }
}
```

### Site Information

Edit `_config.yml`:

```yaml
title: Your Name
description: Your description
url: https://yourdomain.com
author:
  name: Your Name
  email: your@email.com
  linkedin: your-linkedin
  github: your-github
```

## 📝 Blog Categories

Available categories:
- Power Platform
- Dynamics 365
- Azure
- Best Practices
- Architecture

## 🔧 Components

### Blog Card (_includes/blog-card.html)

Reusable component for displaying blog post previews.

Usage:
```liquid
{% include blog-card.html post=post %}
```

### Header (_includes/header.html)

Site navigation header. Automatically included in all pages using `layout: default`.

### Footer (_includes/footer.html)

Site footer with copyright. Automatically included in all pages using `layout: default`.

## 🌐 Deployment to GitHub Pages

### Option 1: Automatic (GitHub Actions)

GitHub Pages will automatically build Jekyll sites. Just push your changes:

```bash
git add .
git commit -m "Add new blog post"
git push origin main
```

### Option 2: Manual Build

```bash
# Build locally
bundle exec jekyll build

# Commit _site folder
git add _site
git commit -m "Update site"
git push
```

## 📊 Analytics & SEO

### SEO Optimization

The site includes:
- ✅ jekyll-seo-tag plugin
- ✅ Automatic meta tags
- ✅ OpenGraph tags
- ✅ Twitter Cards
- ✅ XML Sitemap
- ✅ RSS Feed at `/feed.xml`

### Adding Google Analytics

Add to `_config.yml`:

```yaml
google_analytics: UA-XXXXXXXX-X
```

## 🛠️ Troubleshooting

### Jekyll won't start

```bash
# Clean and rebuild
bundle exec jekyll clean
bundle exec jekyll serve
```

### Gem installation errors

```bash
# Update bundler
gem update bundler

# Reinstall gems
bundle install
```

### Port already in use

```bash
# Use different port
bundle exec jekyll serve --port 4001
```

## 📚 Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📧 Contact

- LinkedIn: [jmaristizabalg](https://linkedin.com/in/jmaristizabalg)
- GitHub: [JAristizabal94](https://github.com/JAristizabal94)
- Email: contact@jaristizabal.dev

---

© 2024 Jose Aristizabal. All Rights Reserved.
