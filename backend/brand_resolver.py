"""
Unilogic AI - Brand & Manufacturer Entity Resolution Module
Cleans messy supplier inputs, removes placeholders, matches canonical UniCat master entries, and preserves legal suffixes & symbols (®, ™).
"""

import re
from difflib import SequenceMatcher

# Known placeholder values that indicate empty / unbranded fields
PLACEHOLDERS = {
    '-- UNBRANDED --', '-- NO UNILOG BRAND --', '-- NO DIB BRAND --',
    'UNBRANDED', 'NO BRAND', 'NONE', 'N/A', 'UNKNOWN', 'NULL', ''
}

# Pre-populated canonical UniCat Master Brand dictionary for common catalog brands
CANONICAL_BRAND_DB = [
    {
        "input_patterns": ["FRIGIDAIRE", "PDSH", "APPDE", "RHEEM"],
        "manufacturer": "Rheem Manufacturing",
        "brand": "FRIGIDAIRE®",
        "trade_name": "Professional Series"
    },
    {
        "input_patterns": ["3M", "3MABR", "JAM INDUSTRIAL"],
        "manufacturer": "3M",
        "brand": "3M®",
        "trade_name": "Cubiteron™"
    },
    {
        "input_patterns": ["FREUD", "DCB"],
        "manufacturer": "Freud Inc",
        "brand": "Freud®",
        "trade_name": "Diablo"
    },
    {
        "input_patterns": ["KOHLER", "K-"],
        "manufacturer": "Kohler Co.",
        "brand": "KOHLER®",
        "trade_name": "Artifacts®"
    },
    {
        "input_patterns": ["MOEN", "7594"],
        "manufacturer": "Moen Incorporated",
        "brand": "MOEN®",
        "trade_name": "Align®"
    },
    {
        "input_patterns": ["MILWAUKEE", "2804"],
        "manufacturer": "Milwaukee Electric Tool Corp",
        "brand": "Milwaukee®",
        "trade_name": "M18 FUEL™"
    },
    {
        "input_patterns": ["DEWALT", "DCD"],
        "manufacturer": "DeWalt Industrial Tool Co.",
        "brand": "DEWALT®",
        "trade_name": "20V MAX*"
    }
]

def is_placeholder(val: str) -> bool:
    """Returns True if the value is a known unbranded/empty placeholder."""
    if not val or not isinstance(val, str):
        return True
    cleaned = val.strip().upper()
    return cleaned in PLACEHOLDERS

def resolve_brand_and_manufacturer(part_num: str, part_desc: str, e1_brand: str, unilog_brand: str, dib_brand: str, part_manuf: str) -> dict:
    """
    Resolves messy input fields into canonical MANUFACTURER_NAME, BRAND_NAME, and TRADE_NAME.
    """
    # Step 1: Clean raw inputs
    brands_given = [b for b in [e1_brand, unilog_brand, dib_brand] if not is_placeholder(b)]
    manuf_given = part_manuf if not is_placeholder(part_manuf) else ""
    
    # Combined context string for fuzzy matching
    context = f"{part_num} {part_desc} {' '.join(brands_given)} {manuf_given}".upper()
    
    best_match = None
    highest_score = 0.0
    
    for entry in CANONICAL_BRAND_DB:
        score = 0.0
        for pat in entry["input_patterns"]:
            if pat.upper() in context:
                score += 0.4
        
        # Fuzzy similarity check against brand & manufacturer
        sim_b = SequenceMatcher(None, context, entry["brand"].upper()).ratio()
        sim_m = SequenceMatcher(None, context, entry["manufacturer"].upper()).ratio()
        total_score = score + max(sim_b, sim_m)
        
        if total_score > highest_score:
            highest_score = total_score
            best_match = entry
            
    if best_match and highest_score > 0.35:
        return {
            "manufacturer_name": best_match["manufacturer"],
            "brand_name": best_match["brand"],
            "trade_name": best_match.get("trade_name", ""),
            "confidence": min(round(highest_score, 2), 0.99)
        }
    
    # Fallback heuristic: use non-placeholder brand or clean manufacturer string
    fallback_brand = brands_given[0] if brands_given else (manuf_given or "Generic")
    # Clean code suffixes like (APPDE) or (2435)
    clean_manuf = re.sub(r'\s*\([A-Z0-9]+\)', '', manuf_given).strip() if manuf_given else fallback_brand
    clean_brand = re.sub(r'\s*\([A-Z0-9]+\)', '', fallback_brand).strip()
    
    # Append ® if missing and not generic
    if clean_brand and clean_brand.lower() != 'generic' and not ('®' in clean_brand or '™' in clean_brand):
        clean_brand += '®'

    return {
        "manufacturer_name": clean_manuf or clean_brand,
        "brand_name": clean_brand,
        "trade_name": "",
        "confidence": 0.75
    }

if __name__ == "__main__":
    res = resolve_brand_and_manufacturer(
        part_num="PDSH4816AF",
        part_desc="PDSH4816AF Dishwasher SS - Display Only",
        e1_brand="-- Unbranded --",
        unilog_brand="-- No Unilog Brand --",
        dib_brand="-- No DIB Brand --",
        part_manuf="Appliance Dealers Cooperative (APPDE)"
    )
    print("Resolved Entity Result:")
    print(res)
