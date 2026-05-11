"""Local story library management — saves and loads stories from disk."""

import json
import uuid
from datetime import datetime
from pathlib import Path

LIBRARY_DIR = Path.home() / ".storybook_generator"
LIBRARY_INDEX_FILE = LIBRARY_DIR / "stories.json"


def _ensure_library_dir():
    """Create library directory if it doesn't exist."""
    LIBRARY_DIR.mkdir(parents=True, exist_ok=True)


def _load_index() -> dict:
    """Load the story index from disk."""
    _ensure_library_dir()
    if LIBRARY_INDEX_FILE.exists():
        with open(LIBRARY_INDEX_FILE) as f:
            return json.load(f)
    return {"stories": []}


def _save_index(index: dict):
    """Save the story index to disk."""
    _ensure_library_dir()
    with open(LIBRARY_INDEX_FILE, "w") as f:
        json.dump(index, f, indent=2)


class Story:
    """A single story in the library."""

    def __init__(
        self,
        title: str,
        html_content: str,
        child_name: str | None,
        age_tier: str,
        story_topic: str,
        illustrations: dict[int, bytes],
    ):
        self.id = str(uuid.uuid4())
        self.title = title
        self.html_content = html_content
        self.child_name = child_name
        self.age_tier = age_tier
        self.story_topic = story_topic[:100]  # First 100 chars
        self.illustrations = illustrations
        self.created_at = datetime.now().isoformat()

    def save_to_library(self) -> str:
        """Save story to local library. Returns the story directory path."""
        story_dir = LIBRARY_DIR / self.id
        story_dir.mkdir(parents=True, exist_ok=True)

        # Save HTML
        html_file = story_dir / "index.html"
        with open(html_file, "w") as f:
            f.write(self.html_content)

        # Save illustrations
        images_dir = story_dir / "images"
        images_dir.mkdir(exist_ok=True)
        for page_num, image_data in self.illustrations.items():
            img_file = images_dir / f"page_{page_num}.png"
            with open(img_file, "wb") as f:
                f.write(image_data)

        # Update index
        index = _load_index()
        entry = {
            "id": self.id,
            "title": self.title,
            "child_name": self.child_name,
            "age_tier": self.age_tier,
            "story_topic": self.story_topic,
            "created_at": self.created_at,
            "path": str(story_dir),
        }
        index["stories"].insert(0, entry)  # Newest first
        _save_index(index)

        return str(story_dir)


def get_library() -> list[dict]:
    """Get all stories in the library, ordered newest first."""
    index = _load_index()
    return index.get("stories", [])


def get_story_by_id(story_id: str) -> dict | None:
    """Get a story by ID."""
    index = _load_index()
    for story in index.get("stories", []):
        if story["id"] == story_id:
            return story
    return None


def delete_story(story_id: str) -> bool:
    """Delete a story from the library."""
    story_dir = LIBRARY_DIR / story_id
    if story_dir.exists():
        import shutil
        shutil.rmtree(story_dir)

    index = _load_index()
    index["stories"] = [s for s in index.get("stories", []) if s["id"] != story_id]
    _save_index(index)
    return True
