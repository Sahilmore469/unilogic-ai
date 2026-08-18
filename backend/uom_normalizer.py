"""
Unilogic AI - Master UOM Normalization Module
Standardizes Unit-of-Measure abbreviations, spacing, and casing according to Unilog Master UOM Standards.
"""

import re

# Approved UOM mappings (raw/variations -> canonical captured form)
UOM_MAP = {
    # Length / Dimensions
    'INCH': 'in', 'INCHES': 'in', 'IN.': 'in', 'IN': 'in', '"': 'in',
    'FOOT': 'ft', 'FEET': 'ft', 'FT.': 'ft', 'FT': 'ft', "'": 'ft',
    'MILLIMETER': 'mm', 'MILLIMETERS': 'mm', 'MM.': 'mm', 'MM': 'mm',
    'CENTIMETER': 'cm', 'CENTIMETERS': 'cm', 'CM.': 'cm', 'CM': 'cm',
    'METER': 'm', 'METERS': 'm', 'M.': 'm',

    # Electrical
    'VOLT': 'V', 'VOLTS': 'V', 'VAC': 'V', 'VDC': 'V', 'V.': 'V', 'v': 'V',
    'AMP': 'A', 'AMPS': 'A', 'AMPERE': 'A', 'AMPERES': 'A', 'A.': 'A', 'a': 'A',
    'WATT': 'W', 'WATTS': 'W', 'W.': 'W', 'w': 'W',
    'KILOWATT': 'kW', 'KILOWATTS': 'kW', 'KW': 'kW', 'KW.': 'kW',
    'KILOWATT-HOUR': 'kW-hr', 'KWH': 'kW-hr', 'KW-HR': 'kW-hr', 'KWH.': 'kW-hr',
    'HERTZ': 'Hz', 'HZ': 'Hz',

    # Pressure & Flow
    'PSI': 'psi', 'P.S.I.': 'psi', 'PSI.': 'psi',
    'GPM': 'gpm', 'GALLONS PER MINUTE': 'gpm',
    'CFM': 'cfm', 'CUBIC FEET PER MINUTE': 'cfm',
    'BAR': 'bar',

    # Acoustics / Sound
    'DBA': 'dBA', 'DB(A)': 'dBA', 'DECIBEL': 'dBA', 'DECIBELS': 'dBA', 'DB': 'dB',

    # Weight / Mass
    'POUND': 'lb', 'POUNDS': 'lb', 'LBS': 'lb', 'LBS.': 'lb', 'LB.': 'lb', 'LB': 'lb',
    'OUNCE': 'oz', 'OUNCES': 'oz', 'OZ.': 'oz', 'OZ': 'oz',
    'GRAM': 'g', 'GRAMS': 'g', 'G.': 'g',
    'KILOGRAM': 'kg', 'KILOGRAMS': 'kg', 'KG.': 'kg', 'KG': 'kg',

    # Power & Performance
    'HORSEPOWER': 'hp', 'HP': 'hp', 'H.P.': 'hp',
    'RPM': 'rpm', 'REVOLUTIONS PER MINUTE': 'rpm',

    # Temperature
    'DEG F': 'deg F', 'DEGREES F': 'deg F', 'FAHRENHEIT': 'deg F', '°F': 'deg F', 'F': 'deg F',
    'DEG C': 'deg C', 'DEGREES C': 'deg C', 'CELSIUS': 'deg C', '°C': 'deg C',
}

def normalize_uom_string(uom_str: str) -> str:
    """Normalizes a raw UOM string to the approved Unilog form."""
    if not uom_str or not isinstance(uom_str, str):
        return ""
    
    cleaned = uom_str.strip()
    upper = cleaned.upper().rstrip('.')
    if upper in UOM_MAP:
        return UOM_MAP[upper]
    return cleaned

def format_value_with_uom(val: str, uom: str) -> str:
    """
    Formats a numeric/fraction value with its UOM, ensuring exact single space.
    Example: (24, "in") -> "24 in"
    """
    val_str = str(val).strip() if val is not None else ""
    norm_uom = normalize_uom_string(uom) if uom else ""
    
    if not val_str:
        return ""
    if not norm_uom:
        return val_str
    
    # Avoid duplicate unit attachment if val_str already ends with norm_uom
    if val_str.endswith(f" {norm_uom}"):
        return val_str
    
    return f"{val_str} {norm_uom}"

def clean_uom_in_text(text: str) -> str:
    """
    Scans free text for embedded non-standard UOM patterns and normalizes spacing & casing.
    Example: '24in W x 24-1/4in D' -> '24 in W x 24-1/4 in D'
    """
    if not text:
        return ""
    
    # Normalize patterns like '24in' -> '24 in', '120V' -> '120 V', '15A' -> '15 A'
    result = re.sub(r'(\d+(?:-\d+/\d+|\.\d+|/\d+)?)\s*([a-zA-Z"]+)', 
                    lambda m: _replace_unit_match(m.group(1), m.group(2)), text)
    return result

def _replace_unit_match(num_part, unit_part):
    norm_unit = normalize_uom_string(unit_part)
    # If recognized or simple unit code, separate with space
    if unit_part.upper().rstrip('.') in UOM_MAP or unit_part.lower() in ['in', 'ft', 'v', 'a', 'w', 'dba', 'hp', 'psi', 'gpm']:
        return f"{num_part} {norm_unit}"
    return f"{num_part} {unit_part}"

if __name__ == "__main__":
    test_cases = [
        ("24", "INCHES"),
        ("120", "VOLT"),
        ("15", "AMPS"),
        ("47", "DBA"),
        ("50-1/4", "IN."),
    ]
    print("UOM Normalization Tests:")
    for val, uom in test_cases:
        print(f"  {val} + {uom} -> {format_value_with_uom(val, uom)}")
