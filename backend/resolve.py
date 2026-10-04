import os
import json
from google import genai
from google.genai import types

def resolve_code(task: str, code: str) -> dict:
    try:
        model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
        client = genai.Client()

        prompt = f"""You are an expert Python tutor. 
The student was given the following task:
{task}

The student submitted the following revised code:
```python
{code}
```

Evaluate if the revised code correctly accomplishes the task and resolves any major misconceptions. Ignore minor stylistic issues; focus on logical correctness and syntax.

Respond ONLY with a valid JSON object in the following format:
{{
  "resolved": true or false,
  "feedback": "A short, encouraging sentence explaining why it is correct, or what is still wrong."
}}
"""
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1,
            )
        )
        
        raw_text = response.text.strip()
        
        if raw_text.startswith("```"):
            lines = raw_text.split("\n")
            if lines[0].startswith("```"): lines = lines[1:]
            if lines[-1].startswith("```"): lines = lines[:-1]
            raw_text = "\n".join(lines).strip()
            
        return json.loads(raw_text)
    except Exception as e:
        print(f"FATAL Resolve error: {e}")
        return {
            "resolved": False,
            "feedback": f"CRASH: {str(e)}"
        }
