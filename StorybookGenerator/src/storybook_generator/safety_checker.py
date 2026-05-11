"""Content safety screening for story inputs and generated story text."""

import ollama


def screen_input(story_topic: str, child_name: str | None, moral: str | None, dedication: str | None) -> dict:
    """Screen user inputs for inappropriate content. Returns {'safe': bool, 'reason': str}"""

    inputs_to_check = [
        f"story topic: {story_topic}",
        f"child name: {child_name}" if child_name else None,
        f"moral: {moral}" if moral else None,
        f"dedication: {dedication}" if dedication else None,
    ]
    inputs_text = "\n".join([x for x in inputs_to_check if x])

    prompt = f"""You are a content safety checker for a children's story app. Your job is to determine if user inputs are safe and appropriate for generating a children's story.

SCREENING CRITERIA - BLOCK IF ANY OF THESE:
1. Sexual content of any kind
2. Graphic violence or gore (cartoon violence is OK, graphic violence is not)
3. Content demeaning a protected group
4. Request to portray a real, named individual in a fictional scenario
5. Content designed to frighten, distress, or psychologically harm a child
6. Hate speech or slurs

ALLOWED (do not block):
- Mild adventure tension (child lost in woods, suspenseful situations resolved positively)
- Conflict between characters resolved through kindness
- Characters making mistakes and learning
- Themes of sadness/loneliness that are processed and resolved
- Any cultural background, name, or setting

USER INPUTS TO EVALUATE:
{inputs_text}

RESPOND WITH ONLY THIS FORMAT:
safe: yes
reason: (empty if safe, or brief reason if not safe)

RESPONSE:"""

    response = ollama.generate(
        model="gemma3:12b",
        prompt=prompt,
        stream=False,
    )

    response_text = response["response"].strip().lower()

    # Parse response
    lines = [line.strip() for line in response_text.split("\n")]
    safe = "yes" in lines[0] if lines else False
    reason = lines[1].replace("reason:", "").strip() if len(lines) > 1 else ""

    return {"safe": safe, "reason": reason}


def screen_generated_story(story_text: str) -> dict:
    """Screen the generated story for inappropriate content. Returns {'safe': bool, 'reason': str}"""

    prompt = f"""You are a content safety checker. Evaluate if this generated children's story is appropriate and safe.

BLOCK IF:
1. Contains violence (fighting, hitting, killing, aggressive conflict)
2. Contains death or graphic injury
3. Scary imagery designed to frighten children
4. Sexual or romantic content
5. Mockery, cruelty, or bullying portrayed approvingly
6. Substance abuse, illegal activity, or criminal behavior portrayed as acceptable
7. Any real political figures, living public figures, or religious figures as characters

ALLOW:
- Mild adventure tension resolved positively
- Characters learning from mistakes
- Themes of sadness/loss processed constructively

STORY TEXT:
{story_text}

RESPOND ONLY WITH:
safe: yes/no
reason: (empty if safe, or reason if not)

RESPONSE:"""

    response = ollama.generate(
        model="gemma3:12b",
        prompt=prompt,
        stream=False,
    )

    response_text = response["response"].strip().lower()

    # Parse response
    lines = [line.strip() for line in response_text.split("\n")]
    safe = "yes" in lines[0] if lines else False
    reason = lines[1].replace("reason:", "").strip() if len(lines) > 1 else ""

    return {"safe": safe, "reason": reason}
