"""Flask application entry point."""

from flask import Flask, jsonify, render_template, request, redirect, Response
import queue
import threading

from . import ollama_manager, story_generator, safety_checker, html_assembler, library

# Global queue for progress messages
_progress_queue = queue.Queue()

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/create")
def create():
    return render_template("create.html")


def _emit_progress(message: str):
    """Send a progress message to all connected clients."""
    _progress_queue.put(f"data: {message}\n\n")


@app.route("/api/progress")
def progress_stream():
    """SSE endpoint for real-time progress updates."""
    def generate_progress():
        while True:
            try:
                msg = _progress_queue.get(timeout=1)
                yield msg
            except queue.Empty:
                pass

    return Response(generate_progress(), mimetype="text/event-stream")


@app.route("/api/story/generate", methods=["POST"])
def generate():
    """Generate a story from form inputs."""
    try:
        data = request.json

        # Validate required fields
        if not data.get("story_topic"):
            return jsonify({"error": "Story topic is required"}), 400
        if "child_age" not in data:
            return jsonify({"error": "Child age is required"}), 400

        # Screen inputs
        _emit_progress("Checking your inputs...")
        input_check = safety_checker.screen_input(
            story_topic=data["story_topic"],
            child_name=data.get("child_name"),
            moral=data.get("moral_lesson"),
            dedication=data.get("dedicated_to"),
        )
        if not input_check["safe"]:
            return jsonify(
                {"error": f"Story input isn't quite right: {input_check['reason']}"}
            ), 400

        # Generate story
        _emit_progress("Writing your story...")
        req = story_generator.StoryRequest(
            story_topic=data["story_topic"],
            child_age=int(data["child_age"]),
            child_name=data.get("child_name") or None,
            main_character=data.get("main_character") or None,
            story_theme=data.get("story_theme", "Heartwarming"),
            moral_lesson=data.get("moral_lesson") or None,
            dedicated_to=data.get("dedicated_to") or None,
        )

        pages = story_generator.generate_story(req)

        # Screen generated story
        _emit_progress("Checking story safety...")
        story_text = "\n".join([p.get("text", "") for p in pages])
        story_check = safety_checker.screen_generated_story(story_text)
        if not story_check["safe"]:
            return jsonify({"error": "Something went wrong generating your story — please try again or change your inputs."}), 400

        # Assemble HTML
        _emit_progress("Building your storybook...")
        title = data.get("story_title") or pages[0].get("title", "My Story")
        html_content = html_assembler.assemble_html(
            title=title,
            pages=pages,
        )

        # Save to library (no images yet, empty dict)
        story_obj = library.Story(
            title=title,
            html_content=html_content,
            child_name=data.get("child_name"),
            age_tier=story_generator._get_age_tier(int(data["child_age"]))[0],
            story_topic=data["story_topic"],
            illustrations={},
        )
        story_obj.save_to_library()

        _emit_progress("Done! Opening your story...")
        return jsonify({
            "success": True,
            "story_id": story_obj.id,
            "title": title,
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route("/story/<story_id>")
def view_story(story_id: str):
    """View a saved story."""
    story = library.get_story_by_id(story_id)
    if not story:
        return "Story not found", 404

    story_dir = story["path"]
    html_file = f"{story_dir}/index.html"
    with open(html_file) as f:
        return f.read()


@app.route("/api/library")
def get_library():
    """Get all stories in the library."""
    return jsonify({"stories": library.get_library()})


@app.route("/api/story/<story_id>/delete", methods=["POST"])
def delete_story(story_id: str):
    """Delete a story from the library."""
    library.delete_story(story_id)
    return jsonify({"success": True})


@app.route("/api/ollama/status")
def ollama_status():
    return jsonify({"running": ollama_manager.is_running()})


@app.route("/api/ollama/start", methods=["POST"])
def ollama_start():
    return jsonify(ollama_manager.start())


@app.route("/api/ollama/stop", methods=["POST"])
def ollama_stop():
    return jsonify(ollama_manager.stop())


def main():
    print("Opening Storybook Generator at http://127.0.0.1:5100")
    app.run(host="127.0.0.1", port=5100, debug=False)
