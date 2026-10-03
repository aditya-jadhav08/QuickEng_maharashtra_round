import argparse
import pandas as pd
import time
from diagnose import diagnose

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ids", type=str, help="Comma separated IDs")
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args()

    df = pd.read_csv("data/test_cases.csv")
    
    if args.ids:
        ids = [int(i.strip()) for i in args.ids.split(",")]
        df = df[df['id'].isin(ids)]
    elif not args.all:
        print("Please specify --ids or --all")
        return

    results = []
    correct_count = 0
    unsure_count = 0
    wrong_rows = []

    print(f"Evaluating {len(df)} rows...")

    for idx, row in df.iterrows():
        print(f"Processing ID {row['id']}...")
        res = diagnose(row['task'], row['student_code'])
        
        is_correct = res['label'] == row['true_label']
        if is_correct: correct_count += 1
        if res['label'] == "UNSURE": unsure_count += 1
        
        if not is_correct:
            wrong_rows.append({
                "id": row['id'],
                "true": row['true_label'],
                "predicted": res['label'],
                "reasoning": res['reasoning']
            })
            
        res_row = row.to_dict()
        res_row.update({
            "predicted_label": res['label'],
            "confidence": res['confidence'],
            "evidence": res['evidence'],
            "evidence_verified": res['evidence_verified'],
            "needs_clarification": res['needs_clarification'],
            "correct": is_correct
        })
        results.append(res_row)
        
        time.sleep(1)

    res_df = pd.DataFrame(results)
    res_df.to_csv("results.csv", index=False)

    print("\\n--- EVALUATION RESULTS ---")
    if len(df) > 0:
        print(f"Overall Accuracy: {correct_count / len(df) * 100:.2f}% ({correct_count}/{len(df)})")
    print(f"UNSURE Predictions: {unsure_count}")
    
    if "true_label" in res_df.columns and len(df) > 0:
        print("\\nAccuracy per true_label:")
        grouped = res_df.groupby("true_label")["correct"].mean() * 100
        print(grouped)
        
        print("\\nConfusion Table (True vs Predicted):")
        print(pd.crosstab(res_df['true_label'], res_df['predicted_label']))

    if "notes" in res_df.columns and len(df) > 0:
        lookalikes = res_df[res_df['notes'].fillna("").str.contains("look-alike")]
        if len(lookalikes) > 0:
            print(f"\\nAccuracy on look-alikes: {lookalikes['correct'].mean() * 100:.2f}%")
            
    print("\\nWrong Rows:")
    for w in wrong_rows:
        print(f"ID {w['id']} | True: {w['true']} | Pred: {w['predicted']} | Reason: {w['reasoning']}")

if __name__ == "__main__":
    main()
