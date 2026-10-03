import json
import os

transcript_path = "/home/dionysus/.gemini/antigravity/brain/8b81b9ef-2221-421f-833b-6671ba526611/.system_generated/logs/transcript_full.jsonl"
largest_csv = ""

with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            content_val = data.get('content', '')
            if isinstance(content_val, list):
                text_parts = [p.get('text', '') for p in content_val if 'text' in p]
                content_val = "".join(text_parts)
            elif not isinstance(content_val, str):
                continue
                
            if 'ID,Incorrect_Code' in content_val:
                start_idx = content_val.find('ID,Incorrect_Code')
                if start_idx != -1:
                    csv_cand = content_val[start_idx:]
                    if len(csv_cand) > len(largest_csv):
                        largest_csv = csv_cand
        except Exception as e:
            pass

if largest_csv and len(largest_csv) > 1000:
    with open("misconceptions.csv", "w", encoding="utf-8") as out:
        out.write(largest_csv)
    print(f"Successfully extracted CSV of length {len(largest_csv)}")
else:
    print("Failed to find valid large CSV.")
