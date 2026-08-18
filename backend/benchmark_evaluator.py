"""
Unilogic AI - Benchmark Evaluator Module
Evaluates enriched outputs against the ground truth dataset ('Unihack_ Expected Output - Delivery Format.csv').
"""

import pandas as pd
import os

GROUND_TRUTH_PATH = r'C:\Users\Sahil more\Downloads\Unihack_ Expected Output - Delivery Format.csv'

def evaluate_against_ground_truth(predicted_df: pd.DataFrame = None) -> dict:
    """
    Evaluates predictions against ground truth dataset and returns structured performance scorecards.
    """
    if not os.path.exists(GROUND_TRUTH_PATH):
        return {"error": "Ground truth dataset file not found"}

    gt_df = pd.read_csv(GROUND_TRUTH_PATH)
    total_gt_rows = len(gt_df)
    
    if predicted_df is None or len(predicted_df) == 0:
        # Run pipeline engine on ground truth input rows to generate predictions dynamically
        from backend.pipeline_engine import process_batch
        predicted_df = process_batch(gt_df[['Mfg_Part_Num', 'Part_Desc', 'E1_Brand', 'Unilog_Brand', 'DIB_Brand', 'Part_Manuf']])

    total_fields_evaluated = 0
    exact_matches = 0
    fuzzy_matches = 0
    uom_correct = 0
    uom_total = 0
    inv_constraint_pass = 0
    mob_constraint_pass = 0

    field_scores = {}

    for idx in range(min(len(gt_df), len(predicted_df))):
        gt_row = gt_df.iloc[idx]
        pred_row = predicted_df.iloc[idx]

        # 1. Invoice Desc Constraint Check
        inv_desc = str(pred_row.get('INVOICE_DESC', ''))
        if len(inv_desc) <= 40 and (inv_desc.isupper() or not inv_desc):
            inv_constraint_pass += 1

        # 2. Mobile Desc Constraint Check
        mob_desc = str(pred_row.get('MOBILE_DESC', ''))
        if 50 <= len(mob_desc) <= 90 or not mob_desc:
            mob_constraint_pass += 1

        # 3. Field level comparison
        for col in gt_df.columns:
            gt_val = str(gt_row.get(col, '')).strip()
            pred_val = str(pred_row.get(col, '')).strip()

            if pd.isna(gt_row.get(col)) or gt_val == '' or gt_val == 'nan':
                continue

            total_fields_evaluated += 1

            if gt_val == pred_val:
                exact_matches += 1
                fuzzy_matches += 1
            elif gt_val.lower() in pred_val.lower() or pred_val.lower() in gt_val.lower():
                fuzzy_matches += 1

            # UOM Column check
            if 'UOM' in col:
                uom_total += 1
                if gt_val.lower() == pred_val.lower():
                    uom_correct += 1

    field_accuracy = (exact_matches / total_fields_evaluated * 100) if total_fields_evaluated > 0 else 0.0
    fuzzy_accuracy = (fuzzy_matches / total_fields_evaluated * 100) if total_fields_evaluated > 0 else 0.0
    uom_accuracy = (uom_correct / uom_total * 100) if uom_total > 0 else 100.0
    inv_pass_rate = (inv_constraint_pass / len(gt_df) * 100) if len(gt_df) > 0 else 100.0
    mob_pass_rate = (mob_constraint_pass / len(gt_df) * 100) if len(gt_df) > 0 else 100.0

    return {
        "total_rows_evaluated": len(gt_df),
        "total_fields_checked": total_fields_evaluated,
        "exact_match_rate": round(field_accuracy, 2),
        "fuzzy_match_rate": round(fuzzy_accuracy, 2),
        "uom_precision": round(uom_accuracy, 2),
        "invoice_desc_compliance": round(inv_pass_rate, 2),
        "mobile_desc_compliance": round(mob_pass_rate, 2),
        "overall_score": round((fuzzy_accuracy * 0.5 + uom_accuracy * 0.25 + inv_pass_rate * 0.25), 2)
    }

if __name__ == "__main__":
    scores = evaluate_against_ground_truth()
    print("Benchmark Ground Truth Evaluation Results:")
    for k, v in scores.items():
        print(f"  {k}: {v}")
