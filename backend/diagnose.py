import os
import json
import time
import csv
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Load the master dataset
MISCONCEPTIONS = {}
MISCONCEPTION_LIST_STR = ""

try:
    with open("data/misconceptions.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # We prefix the ID with "M" to keep the AI consistent (e.g. M1, M2... M300)
            m_id = f"M{row['ID'].strip()}"
            desc = row['Underlying_Misconception'].strip()
            
            MISCONCEPTIONS[m_id] = {
                "description": desc,
                "hint_socratic": row.get('Hint_L1_Socratic', '').strip(),
                "hint_conceptual": row.get('Hint_L2_Conceptual', '').strip(),
                "hint_targeted": row.get('Hint_L3_Targeted', '').strip(),
                "resolution_question": row.get('Resolution_Question', '').strip()
            }
            MISCONCEPTION_LIST_STR += f"{m_id}: {desc}\\n"
except Exception as e:
    print("Warning: Could not load misconceptions dataset.", e)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

def diagnose(task: str, code: str) -> dict:
    prompt = f"""You are a Python tutor that diagnoses the underlying misconception behind a beginner's code, not just whether it is wrong.

Known misconceptions (choose only from these IDs):
{MISCONCEPTION_LIST_STR}

Special labels:
- NONE: the code is correct for the task and shows no misconception.
- UNSURE: the code is wrong but the evidence does not clearly match any listed misconception.

Task given to the student:
{task}

Student's code:
{code}

Instructions:
1. Work out what the student was trying to do and why the code fails or misbehaves.
2. CRITICAL PRIORITY: Focus deeply on logical, structural, and conceptual errors. If the code contains both a simple syntax error (like a missing colon) and a deeper conceptual misunderstanding (like misunderstanding variable scope), ALWAYS classify the conceptual misunderstanding as the primary label. Treat syntax errors as secondary.
3. Pick the single best label from the list. If two misconceptions could produce the same mistake, choose the one best supported by the code itself and name the other in "alternative".
4. Quote the exact line or fragment of the student's code that is your evidence.
5. Do not give the fixed code or the answer.

Return ONLY valid JSON with these keys:
{{"label": "M1", "confidence": 0.0, "evidence": "exact fragment from the code", "reasoning": "one or two sentences", "alternative": "M5 or NONE"}}"""

    data = {}
    for attempt in range(4):
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.0,
                    response_mime_type="application/json"
                )
            )
            raw_text = response.text if not callable(response.text) else response.text()
            clean_text = raw_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)
            break
        except Exception as e:
            err_str = str(e).lower()
            if "429" in err_str or "quota" in err_str or "rate" in err_str:
                if attempt < 3:
                    time.sleep(2)
                    continue
            if attempt == 3 or ("429" not in err_str and "quota" not in err_str and "rate" not in err_str):
                if attempt < 1 and isinstance(e, json.JSONDecodeError):
                    continue
                data = {}
                break

    if not isinstance(data, dict):
        data = {}

    label = data.get("label", "UNSURE")
    if label not in MISCONCEPTIONS and label not in ["NONE", "UNSURE"]:
        label = "UNSURE"

    try:
        confidence = float(data.get("confidence", 0.0))
        confidence = max(0.0, min(1.0, confidence))
    except:
        confidence = 0.0

    evidence = data.get("evidence", "")
    reasoning = data.get("reasoning", "")
    alternative = data.get("alternative", "NONE")

    evidence_verified = False
    if evidence:
        clean_ev = "".join(evidence.split())
        clean_code = "".join(code.split())
        if clean_ev and clean_ev in clean_code:
            evidence_verified = True

    # Build the final enriched payload
    label_name = "Not sure"
    hint = ""
    follow_up_question = ""
    
    if label == "NONE":
        label_name = "Looks correct"
    elif label in MISCONCEPTIONS:
        label_name = MISCONCEPTIONS[label]["description"]
        # Pull the Socratic hint and the Follow-up question from Member 2's dataset!
        hint = MISCONCEPTIONS[label]["hint_socratic"]
        follow_up_question = MISCONCEPTIONS[label]["resolution_question"]

    needs_clarification = False
    if label == "UNSURE" or confidence < 0.6:
        needs_clarification = True

    return {
        "label": label,
        "confidence": confidence,
        "evidence": evidence,
        "reasoning": reasoning,
        "alternative": alternative,
        "evidence_verified": evidence_verified,
        "label_name": label_name,
        "needs_clarification": needs_clarification,
        "hint": hint,
        "follow_up_question": follow_up_question
    }
