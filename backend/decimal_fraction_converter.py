"""
Unilogic AI - Decimal to Fraction Converter Module
Implements exact 63 inch fraction conversions (1/64 to 63/64) as specified in Decimal_Fraction lookup rules.
Manufacturers publish decimals (e.g. 0.5, 50.25); trade buyers search fractions (1/2, 50-1/4 in).
"""

import re
from math import gcd

# Build full table of exact 63 fraction lookups (1/64 to 63/64)
DECIMAL_TO_FRACTION_63 = {}
FRACTION_TO_DECIMAL_63 = {}

for num in range(1, 64):
    dec = num / 64.0
    # Simplify fraction num/64
    g = gcd(num, 64)
    simp_num = num // g
    simp_den = 64 // g
    frac_str = f"{simp_num}/{simp_den}"
    
    # Store exact decimal rounded to up to 6 decimal places
    DECIMAL_TO_FRACTION_63[round(dec, 6)] = frac_str
    DECIMAL_TO_FRACTION_63[round(dec, 4)] = frac_str
    DECIMAL_TO_FRACTION_63[round(dec, 3)] = frac_str
    DECIMAL_TO_FRACTION_63[round(dec, 2)] = frac_str
    FRACTION_TO_DECIMAL_63[frac_str] = dec

# Common quick decimal matches
COMMON_DECIMALS = {
    0.5: "1/2",
    0.25: "1/4",
    0.75: "3/4",
    0.125: "1/8",
    0.375: "3/8",
    0.625: "5/8",
    0.875: "7/8",
    0.0625: "1/16",
    0.1875: "3/16",
    0.3125: "5/16",
    0.4375: "7/16",
    0.5625: "9/16",
    0.6875: "11/16",
    0.8125: "13/16",
    0.9375: "15/16"
}

def decimal_to_fraction(val: float, tolerance: float = 0.001) -> str:
    """
    Converts a float value (e.g. 50.25) to a formatted mixed fraction string (e.g. '50-1/4').
    If int part is 0, returns just fraction (e.g. '1/2').
    """
    if val is None:
        return ""
    
    int_part = int(val)
    frac_part = abs(val - int_part)
    
    if frac_part < tolerance:
        return str(int_part)
    
    # Check exact match in 64ths table
    r_dec = round(frac_part, 4)
    frac_str = None
    if r_dec in DECIMAL_TO_FRACTION_63:
        frac_str = DECIMAL_TO_FRACTION_63[r_dec]
    else:
        # Find closest match within 64ths
        best_diff = float('inf')
        for target_dec, target_frac in DECIMAL_TO_FRACTION_63.items():
            diff = abs(frac_part - target_dec)
            if diff < best_diff:
                best_diff = diff
                frac_str = target_frac
    
    if not frac_str:
        return str(val)
    
    if int_part == 0:
        return frac_str
    return f"{int_part}-{frac_str}"

def convert_decimals_in_text(text: str) -> str:
    """
    Converts decimal dimension representations in text to industrial fraction format.
    Example: '50.25 in' -> '50-1/4 in', '24.25 in D' -> '24-1/4 in D', '0.5 in' -> '1/2 in'
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Find numbers with decimals followed optional space and unit
    def _repl(match):
        full_num_str = match.group(1)
        unit = match.group(2) if match.group(2) else ""
        try:
            val = float(full_num_str)
            frac_res = decimal_to_fraction(val)
            if unit:
                return f"{frac_res} {unit}"
            return frac_res
        except ValueError:
            return match.group(0)

    # Match float numbers like 50.25 or 0.5 followed by optional unit like 'in', 'IN', 'inch'
    pattern = r'(\b\d+\.\d+)\s*(in\b|IN\b|inch\b|INCHES\b|mm\b|cm\b)?'
    return re.sub(pattern, _repl, text)

if __name__ == "__main__":
    print("Decimal to Fraction Converter Tests:")
    test_vals = [0.5, 0.25, 50.25, 24.25, 0.015625, 8.5]
    for v in test_vals:
        print(f"  {v} -> {decimal_to_fraction(v)}")
    
    sample_text = "50.25 in Depth With Door Open, 24.25 in D"
    print(f"\nText Conversion Test:")
    print(f"  Input:  {sample_text}")
    print(f"  Output: {convert_decimals_in_text(sample_text)}")
