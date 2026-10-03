import json
import os

transcript_path = "/home/dionysus/.gemini/antigravity/brain/8b81b9ef-2221-421f-833b-6671ba526611/.system_generated/logs/transcript_full.jsonl"

csv_content = ""
with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            # The content might be a string, or a list of parts
            content_val = data.get('content', '')
            if isinstance(content_val, list):
                # If it's a list, it might be [{"text": "..."}]
                text_parts = [part.get('text', '') for part in content_val if 'text' in part]
                content_val = "".join(text_parts)
            elif not isinstance(content_val, str):
                continue
                
            if 'ID,Incorrect_Code,Correct_Code' in content_val:
                start_idx = content_val.find('ID,Incorrect_Code,Correct_Code')
                if start_idx != -1:
                    csv_content = content_val[start_idx:]
        except Exception as e:
            pass

if csv_content:
    with open("misconceptions.csv", "w", encoding="utf-8") as out:
        out.write(csv_content)
    print("Successfully extracted and saved misconceptions.csv")
else:
    print("Still failed to extract.")
