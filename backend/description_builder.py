"""
Unilogic AI - Description Builder Module
Generates 5 distinct product description formats according to internal content guidelines:
1. INVOICE_DESC (<=40 chars, UPPERCASE)
2. MOBILE_DESC (60-80 chars)
3. SHORT_DESC (Product Title formula)
4. LONG_DESC (Technical specs & dimensions)
5. RETAIL_DESC (Marketing summary)
"""

import re
from backend.uom_normalizer import clean_uom_in_text
from backend.decimal_fraction_converter import convert_decimals_in_text

def build_invoice_description(product_type: str, series: str, mounting: str, cycles: str, material: str, voltage: str, amps: str, depth_open: str, mpn: str) -> str:
    """
    Generates INVOICE_DESC:
    - Constraint: <= 40 characters
    - Constraint: ALL CAPS
    - Uses technical abbreviations (SST for Stainless Steel, LEG for Leg Mounting, etc.)
    """
    # Standard invoice abbreviations
    mat_abbr = "SST" if "STAINLESS" in material.upper() else material.upper()
    mount_abbr = "LEG" if "LEG" in mounting.upper() else mounting.upper()
    
    parts = []
    if product_type:
        parts.append(product_type.upper())
    if mount_abbr:
        parts.append(mount_abbr)
    if cycles:
        parts.append(f"{cycles}")
    if mat_abbr:
        parts.append(mat_abbr)
    if voltage:
        parts.append(f"{voltage}V")
    if amps:
        parts.append(f"{amps}A")
    if depth_open:
        depth_clean = depth_open.upper().replace(' ', '').replace('IN', '') + 'IN'
        parts.append(depth_clean)
        
    candidate = " ".join(parts)
    
    # Strict character truncation / optimization to guarantee <= 40 chars
    if len(candidate) > 40:
        # Try without cycles or compacting
        candidate = f"{product_type.upper()} {mount_abbr} {mat_abbr} {voltage}V {amps}A {depth_open.replace(' ', '')}IN"
    if len(candidate) > 40:
        candidate = candidate[:40]
        
    return candidate.upper()

def build_mobile_description(manuf_name: str, brand_name: str, product_type: str, series: str, mpn: str) -> str:
    """
    Generates MOBILE_DESC:
    - Constraint: Target length 60-80 characters
    - Formula: [Manufacturer Name] [Brand Name], [Product Type], [Series], [MPN]
    """
    clean_brand = brand_name.replace('®', '').replace('™', '').strip()
    
    parts = []
    if manuf_name:
        parts.append(f"{manuf_name} {clean_brand}".strip())
    else:
        parts.append(clean_brand)
        
    if product_type:
        parts.append(product_type)
    if series:
        parts.append(series)
    if mpn:
        parts.append(mpn)
        
    desc = ", ".join(parts)
    
    # Adjust padding/truncation if needed for target 60-80 char window
    if len(desc) < 60:
        desc = f"{manuf_name} {clean_brand}, {product_type}, {series}, Part {mpn}"
    if len(desc) > 80:
        desc = f"{clean_brand}, {product_type}, {series}, {mpn}"
    if len(desc) > 80:
        desc = desc[:80]
        
    return desc

def build_short_description(brand_name: str, series: str, mpn: str, product_type: str, feature: str, mounting: str, cycles: str, material: str) -> str:
    """
    Generates SHORT_DESC (Product Title):
    Formula: [Brand] [Series] [MPN] [Product Name] With [Feature], [Mounting], [Cycles]-Wash Cycle, [Material]
    """
    parts = []
    
    title_head = f"{brand_name} {series}".strip() if series else brand_name
    title_head = f"{title_head} {mpn} {product_type}".strip()
    
    if feature:
        title_head += f" {feature}"
        
    parts.append(title_head)
    
    if mounting:
        parts.append(f"{mounting} Mounting")
    if cycles:
        parts.append(f"{cycles}-Wash Cycle" if str(cycles).isdigit() else f"{cycles} Wash Cycle")
    if material:
        parts.append(material)
        
    raw_title = ", ".join(parts)
    return convert_decimals_in_text(clean_uom_in_text(raw_title))

def build_long_description(brand_name: str, product_type: str, feature: str, series: str, cycles: str, voltage: str, amps: str, mounting: str, size: str, depth_open: str, sound: str, material: str, add_info: str) -> str:
    """
    Generates LONG_DESC:
    Comprehensive standard description string with UOMs and fractions.
    """
    parts = []
    head = f"{brand_name} {product_type}"
    if feature:
        head += f" {feature}"
    parts.append(head)
    
    if series:
        parts.append(series)
    if cycles:
        parts.append(f"{cycles} Wash Cycles" if str(cycles).isdigit() else f"{cycles} Wash Cycles")
    if voltage:
        parts.append(f"{voltage} V")
    if amps:
        parts.append(f"{amps} A")
    if mounting:
        parts.append(f"{mounting} Mounting")
    if size:
        parts.append(size)
    if depth_open:
        parts.append(f"{depth_open} in Depth With Door Open")
    if sound:
        parts.append(f"{sound} dBA Sound Level")
    if material:
        parts.append(material)
    if add_info:
        parts.append(f"Additional Information: {add_info}")
        
    raw_desc = ", ".join(parts)
    return convert_decimals_in_text(clean_uom_in_text(raw_desc))

def build_retail_description(series: str, product_type: str, mounting: str, cycles: str, material: str) -> str:
    """Generates RETAIL_DESC (Consumer friendly marketing summary)."""
    parts = []
    if series:
        parts.append(f"{series} {product_type}".strip())
    else:
        parts.append(product_type)
        
    if mounting:
        parts.append(f"{mounting} Mounting")
    if cycles:
        parts.append(f"{cycles}-Wash Cycle" if str(cycles).isdigit() else f"{cycles} Wash Cycle")
    if material:
        parts.append(material)
        
    return ", ".join(parts)

if __name__ == "__main__":
    inv = build_invoice_description("Dishwasher", "Professional Series", "Leg", "5", "Stainless Steel", "120", "15", "50-1/4", "PDSH4816AF")
    mob = build_mobile_description("Rheem Manufacturing", "FRIGIDAIRE®", "Dishwasher", "Professional Series", "PDSH4816AF")
    sh = build_short_description("FRIGIDAIRE®", "Professional Series", "PDSH4816AF", "Dishwasher", "With CleanBoost™", "Leg", "5", "Stainless Steel")
    
    print("Description Generation Tests:")
    print(f"  Invoice Desc ({len(inv)} chars): {inv}")
    print(f"  Mobile Desc ({len(mob)} chars): {mob}")
    print(f"  Short Desc: {sh}")
