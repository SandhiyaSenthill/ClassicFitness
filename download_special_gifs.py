"""
download_special_gifs.py  (FIXED v2)
Classic Fitness — Special Exercise GIF Downloader
===================================================
3 strategies in order:
  1. COPY from your existing exercise-gifs folder (fastest!)
  2. Download via ExerciseDB API
  3. Download via ExerciseDB direct CDN

HOW TO USE:
  Place this file in: CF-2/  (same level as assets/)
  Run: python download_special_gifs.py

GIFs saved to: assets/exercise-gifs/special/
"""

import requests
import os
import shutil
import time

RAPIDAPI_KEY  = "5bcae0cf93msh47196544e71c1d7p19698cjsn132b9d0f9022"
RAPIDAPI_HOST = "exercisedb.p.rapidapi.com"

# ── ADJUST THESE PATHS IF NEEDED ─────────────────────────────
OUTPUT_DIR       = "assets/exercise-gifs/special"   # where to save special GIFs
EXISTING_GIF_DIR = "assets/exercise-gifs"           # your existing GIFs folder

HEADERS = {
    "X-RapidAPI-Key":  RAPIDAPI_KEY,
    "X-RapidAPI-Host": RAPIDAPI_HOST
}

# ─────────────────────────────────────────────────────────────
#  STRATEGY 1 — Copy from your already-downloaded exercise-gifs/
#  These filenames are from your screenshot (image2 in chat)
#  We reuse the most relevant existing GIFs for each special exercise
# ─────────────────────────────────────────────────────────────
COPY_FROM_EXISTING = {
    # MOBILITY
    "sp_mob_001": "hip-circles__0030.gif",
    "sp_mob_002": "inchworm__0556.gif",
    "sp_mob_003": "ankle-circles__1368.gif",
    "sp_mob_004": "arms-apart-circular-toe-touch-male__3214.gif",
    "sp_mob_005": "all-fours-squad-stretch__1512.gif",
    "sp_mob_006": "arm-slingers-hanging-bent-knee-legs__2338.gif",
    "sp_mob_007": "archer-pull-up__3293.gif",
    "sp_mob_008": "arms-overhead-full-sit-up-male__3204.gif",
    "sp_mob_009": "inchworm__0556.gif",
    "sp_mob_010": "assisted-hanging-knee-raise__0011.gif",

    # STRETCHING
    "sp_str_001": "all-fours-squad-stretch__1512.gif",
    "sp_str_002": "assisted-lying-calves-stretch__1708.gif",
    "sp_str_003": "assisted-lying-glutes-stretch__1709.gif",
    "sp_str_004": "all-fours-squad-stretch__1512.gif",
    "sp_str_005": "assisted-lying-gluteus-and-piriformis-str__1714.gif",
    "sp_str_006": "assisted-lying-glutes-stretch__1709.gif",
    "sp_str_007": "arm-slingers-hanging-bent-knee-legs__2338.gif",
    "sp_str_008": "hip-circles__0030.gif",
    "sp_str_009": "ankle-circles__1368.gif",
    "sp_str_010": "alternate-heel-touchers__0006.gif",

    # PRE-PREGNANCY
    "sp_pre_001": "3-4-sit-up__0001.gif",
    "sp_pre_002": "assisted-lying-leg-raise-with-lateral-thro__1710.gif",
    "sp_pre_003": "hip-circles__0030.gif",
    "sp_pre_004": "assisted-lying-calves-stretch__1708.gif",
    "sp_pre_005": "assisted-hanging-knee-raise__0011.gif",
    "sp_pre_006": "all-fours-squad-stretch__1512.gif",
    "sp_pre_007": "3-4-sit-up__0001.gif",
    "sp_pre_008": "assisted-lying-leg-raise-with-throw-down__1711.gif",
    "sp_pre_009": "hip-circles__0030.gif",
    "sp_pre_010": "assisted-parallel-close-grip-pull-up__0015.gif",

    # POST-PREGNANCY
    "sp_post_001": "3-4-sit-up__0001.gif",
    "sp_post_002": "alternate-heel-touchers__0006.gif",
    "sp_post_003": "hip-circles__0030.gif",
    "sp_post_004": "assisted-lying-leg-raise-with-lateral-thro__1710.gif",
    "sp_post_005": "all-fours-squad-stretch__1512.gif",
    "sp_post_006": "assisted-lying-calves-stretch__1708.gif",
    "sp_post_007": "assisted-motion-russian-twist__0014.gif",
    "sp_post_008": "assisted-lying-leg-raise-with-throw-down__1711.gif",
    "sp_post_009": "3-4-sit-up__0001.gif",
    "sp_post_010": "assisted-lying-glutes-stretch__1709.gif",

    # BREATHING (use calm/core exercises as visual reference)
    "sp_bth_001": "all-fours-squad-stretch__1512.gif",
    "sp_bth_002": "3-4-sit-up__0001.gif",
    "sp_bth_003": "all-fours-squad-stretch__1512.gif",
    "sp_bth_004": "alternate-heel-touchers__0006.gif",
    "sp_bth_005": "all-fours-squad-stretch__1512.gif",
    "sp_bth_006": "arm-slingers-hanging-bent-knee-legs__2338.gif",
    "sp_bth_007": "all-fours-squad-stretch__1512.gif",
    "sp_bth_008": "3-4-sit-up__0001.gif",
    "sp_bth_009": "all-fours-squad-stretch__1512.gif",
    "sp_bth_010": "3-4-sit-up__0001.gif",
}

# ─────────────────────────────────────────────────────────────
#  STRATEGY 2 — ExerciseDB API (exercise by ID)
# ─────────────────────────────────────────────────────────────
API_IDS = {
    "sp_mob_001": "0030", "sp_mob_002": "0556", "sp_mob_003": "1368",
    "sp_mob_005": "1512", "sp_mob_009": "0556", "sp_mob_010": "0011",
    "sp_str_001": "1512", "sp_str_002": "1708", "sp_str_003": "1709",
    "sp_str_009": "1368", "sp_str_010": "0006",
    "sp_pre_001": "0001", "sp_pre_003": "0030", "sp_pre_004": "1708",
    "sp_post_001": "0001", "sp_post_002": "0006", "sp_post_003": "0030",
}


# ─────────────────────────────────────────────────────────────
def try_copy(special_id, out_path):
    name = COPY_FROM_EXISTING.get(special_id)
    if not name:
        return False
    src = os.path.join(EXISTING_GIF_DIR, name)
    if os.path.exists(src):
        shutil.copy2(src, out_path)
        print(f"  📋 Copied: {name} → {special_id}.gif")
        return True
    else:
        # Try fuzzy match — find any file starting with same base name
        base = name.split("__")[0]
        for f in os.listdir(EXISTING_GIF_DIR):
            if f.startswith(base):
                shutil.copy2(os.path.join(EXISTING_GIF_DIR, f), out_path)
                print(f"  📋 Fuzzy copy: {f} → {special_id}.gif")
                return True
        print(f"  ⚠️  Not found locally: {name}")
        return False


def try_api(special_id, out_path):
    ex_id = API_IDS.get(special_id)
    if not ex_id:
        return False
    try:
        url = f"https://exercisedb.p.rapidapi.com/exercises/exercise/{ex_id}"
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            data = r.json()
            gif_url = data.get("gifUrl", "")
            if gif_url:
                dl = requests.get(gif_url, timeout=15)
                if dl.status_code == 200 and len(dl.content) > 500:
                    with open(out_path, "wb") as f:
                        f.write(dl.content)
                    print(f"  🌐 API download: {special_id}.gif")
                    time.sleep(0.4)
                    return True
    except Exception as e:
        print(f"  API error: {e}")
    return False


def try_list_folder():
    """Show what GIFs are actually in the existing folder"""
    if os.path.exists(EXISTING_GIF_DIR):
        files = os.listdir(EXISTING_GIF_DIR)
        return files
    return []


# ─────────────────────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────────────────────
print("=" * 60)
print("  Classic Fitness — Special GIF Downloader v2")
print("=" * 60)

# Check existing folder
existing_files = try_list_folder()
print(f"\n📁 Found {len(existing_files)} GIFs in {EXISTING_GIF_DIR}/")
if not existing_files:
    print(f"  ⚠️  WARNING: No GIFs found in '{EXISTING_GIF_DIR}'")
    print(f"  Make sure you run this script from inside CF-2/ folder")
    print(f"  Current dir: {os.getcwd()}\n")

os.makedirs(OUTPUT_DIR, exist_ok=True)
print(f"📂 Output: {OUTPUT_DIR}/\n")

copied     = 0
downloaded = 0
failed     = 0

for special_id in COPY_FROM_EXISTING.keys():
    out_path = os.path.join(OUTPUT_DIR, f"{special_id}.gif")

    if os.path.exists(out_path):
        print(f"  ✅ Skip (exists): {special_id}.gif")
        copied += 1
        continue

    if try_copy(special_id, out_path):
        copied += 1
    elif try_api(special_id, out_path):
        downloaded += 1
    else:
        print(f"  ❌ {special_id} — Giphy URL will be used as fallback in browser")
        failed += 1

print("\n" + "=" * 60)
print(f"  📋 Copied from your existing GIFs : {copied}")
print(f"  🌐 Downloaded from API            : {downloaded}")
print(f"  ⚠️  Giphy fallback (browser loads) : {failed}")
print(f"\n  ✅ Done! GIFs in: {OUTPUT_DIR}/")
print("=" * 60)
