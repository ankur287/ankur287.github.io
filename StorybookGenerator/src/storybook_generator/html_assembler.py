"""Assembles story data into the fixed HTML storybook template."""

import json
from typing import Any


STORYBOOK_TEMPLATE = """<!DOCTYPE html>
<html lang="en" data-template-version="1.0">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg-color: {{ bg_color }};
      --text-color: {{ text_color }};
      --accent-color: {{ accent_color }};
    }

    body {
      font-family: 'Nunito', sans-serif;
      background: linear-gradient(135deg, var(--bg-color) 0%, #fff8f0 100%);
      color: var(--text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 10px;
    }

    .storybook-container {
      position: relative;
      width: 100%;
      max-width: 800px;
      aspect-ratio: 8.5/11;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      opacity: 0;
      transition: opacity 0.1s;
      background: linear-gradient(to bottom, var(--bg-color) 0%, rgba(255,255,255,0.95) 100%);
    }

    .page.active {
      opacity: 1;
      z-index: 10;
    }

    .page[data-page-type="cover"] {
      justify-content: center;
      text-align: center;
    }

    .page.active.turn-forward {
      animation: pageFlipForward 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }

    .page.active.turn-backward {
      animation: pageFlipBackward 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }

    @keyframes pageFlipForward {
      0% {
        transform: rotateY(0deg);
        opacity: 1;
      }
      100% {
        transform: rotateY(-180deg);
        opacity: 0;
      }
    }

    @keyframes pageFlipBackward {
      0% {
        transform: rotateY(180deg);
        opacity: 0;
      }
      100% {
        transform: rotateY(0deg);
        opacity: 1;
      }
    }

    .page-title {
      font-family: 'Patrick Hand', cursive;
      font-size: 1.1rem;
      color: var(--text-color);
      opacity: 0.6;
      margin-bottom: 16px;
      text-align: center;
    }

    .illustration {
      width: 100%;
      height: 55%;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 20px;
    }

    .page[data-page-type="cover"] .illustration {
      height: 80%;
      margin-bottom: 24px;
    }

    .text-content {
      flex: 1;
      font-family: 'Patrick Hand', cursive;
      font-size: clamp(16px, 2vw, 20px);
      line-height: 1.8;
      color: var(--text-color);
      text-align: justify;
      hyphens: auto;
    }

    .page[data-page-type="cover"] .text-content {
      font-size: clamp(28px, 5vw, 36px);
      font-weight: bold;
      text-align: center;
      line-height: 1.2;
      letter-spacing: 0.5px;
    }

    .page[data-page-type="final"] .text-content {
      font-style: italic;
      opacity: 0.85;
      font-size: clamp(18px, 2vw, 22px);
    }

    .page-number {
      position: absolute;
      bottom: 16px;
      right: 24px;
      font-size: 14px;
      color: var(--text-color);
      opacity: 0.4;
    }

    /* Navigation */
    .nav-button {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.15);
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      color: white;
      transition: background 0.2s, transform 0.1s;
      z-index: 20;
    }

    .nav-button:hover { background: rgba(0, 0, 0, 0.3); transform: translateY(-50%) scale(1.1); }
    .nav-button:active { transform: translateY(-50%) scale(0.95); }

    .nav-button.prev { left: 20px; }
    .nav-button.next { right: 20px; }

    /* Mobile */
    @media (max-width: 768px) {
      .nav-button { width: 40px; height: 40px; font-size: 18px; }
      .page { padding: 24px; }
    }
  </style>
</head>
<body>

<div class="storybook-container">
  {{ pages_html }}
</div>

<button class="nav-button prev" onclick="prevPage()" aria-label="Previous page">←</button>
<button class="nav-button next" onclick="nextPage()" aria-label="Next page">→</button>

<script>
  let currentPage = 0;
  const pages = document.querySelectorAll('.page');
  const totalPages = pages.length;

  function showPage(n) {
    pages.forEach(p => p.classList.remove('active', 'turn-forward', 'turn-backward'));
    if (n < 0) currentPage = 0;
    if (n >= totalPages) currentPage = totalPages - 1;
    pages[currentPage].classList.add('active');
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      pages[currentPage].classList.add('turn-forward');
      currentPage++;
      showPage(currentPage);
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      pages[currentPage].classList.add('turn-backward');
      currentPage--;
      showPage(currentPage);
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
  });

  // Initialize
  showPage(0);
</script>

</body>
</html>
"""


def assemble_html(
    title: str,
    pages: list[dict[str, Any]],
    bg_color: str = "#FFF8F0",
    text_color: str = "#3D2B1F",
    accent_color: str = "#E8633D",
) -> str:
    """Assemble story pages into the fixed HTML template."""

    pages_html = ""
    for page in pages:
        illustration_html = ""
        if page.get("illustration_prompt"):
            # Placeholder: would be replaced with actual image path or data URI
            illustration_html = f'<img class="illustration" src="{page.get("image_path", "")}" alt="Page {page["page_num"]}">'

        text_html = page.get("text", "").replace("\n", "<br>")

        page_html = f"""
    <div class="page" data-page-type="{page['page_type']}">
      <div class="page-title">{page.get("title", "")}</div>
      {illustration_html}
      <div class="text-content">{text_html}</div>
      <div class="page-number">{page['page_num']}</div>
    </div>
    """
        pages_html += page_html

    html = STORYBOOK_TEMPLATE.replace("{{ title }}", title)
    html = html.replace("{{ pages_html }}", pages_html)
    html = html.replace("{{ bg_color }}", bg_color)
    html = html.replace("{{ text_color }}", text_color)
    html = html.replace("{{ accent_color }}", accent_color)

    return html
