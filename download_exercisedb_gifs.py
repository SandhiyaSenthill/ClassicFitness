"""
╔══════════════════════════════════════════════════════════════════╗
║  CLASSIC FITNESS — Full ExerciseDB Downloader (Free Tier)       ║
║                                                                  ║
║  Uses pagination to fetch ALL 1300+ exercises in batches of 10  ║
║  Then downloads GIF for each one using the /image endpoint      ║
║                                                                  ║
║  HOW TO RUN:                                                     ║
║    python download_exercisedb_gifs.py                            ║
║                                                                  ║
║  Run from inside your CF-2 folder.                               ║
║  Can be stopped and resumed — skips already-downloaded files.   ║
╚══════════════════════════════════════════════════════════════════╝
"""

import os, time, json, re
import requests

# ── CONFIG ────────────────────────────────────────────────────────
RAPIDAPI_KEY = "a614875130msh1005e647079d08dp19546djsnd07d6d0a91d6"
HOST         = "exercisedb.p.rapidapi.com"
BASE_URL     = f"https://{HOST}"

OUT_DIR  = os.path.join("assets", "exercise-gifs")
DATA_DIR = os.path.join("assets", "data")
os.makedirs(OUT_DIR,  exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

HEADERS = {
    "X-RapidAPI-Key":  RAPIDAPI_KEY,
    "X-RapidAPI-Host": HOST,
}

BATCH_SIZE   = 10    # free tier returns 10 per page
DELAY_FETCH  = 0.4   # seconds between pagination requests
DELAY_GIF    = 0.4   # seconds between GIF downloads
TOTAL_EXPECTED = 1324  # approximate total exercises in ExerciseDB

# ── HELPERS ───────────────────────────────────────────────────────
def safe_name(s):
    s = (s or "").lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:80]

# ── STEP 1: FETCH ALL EXERCISES VIA PAGINATION ───────────────────
ALL_EXERCISES_FILE = os.path.join(DATA_DIR, "exercises_raw.json")

def fetch_all_exercises():
    """Fetch all exercises using limit/offset pagination."""
    all_exercises = []
    offset = 0

    # Load existing if we have a partial save
    if os.path.exists(ALL_EXERCISES_FILE):
        with open(ALL_EXERCISES_FILE, "r", encoding="utf-8") as f:
            existing = json.load(f)
        if isinstance(existing, list) and len(existing) > 10:
            print(f"  ✅ Found existing exercises_raw.json with {len(existing)} exercises — skipping fetch")
            return existing
        else:
            print(f"  ⚠️  exercises_raw.json only has {len(existing) if isinstance(existing, list) else '?'} exercises — re-fetching all")

    print(f"\n📥 Fetching all exercises from ExerciseDB (batch size: {BATCH_SIZE})...")
    print(f"   Estimated total: ~{TOTAL_EXPECTED} exercises\n")

    while True:
        url = f"{BASE_URL}/exercises"
        params = {"limit": BATCH_SIZE, "offset": offset}

        try:
            r = requests.get(url, headers=HEADERS, params=params, timeout=30)
            if r.status_code == 429:
                print(f"  ⏳ Rate limited at offset {offset} — waiting 5 seconds...")
                time.sleep(5)
                continue
            if r.status_code != 200:
                print(f"  ❌ Error {r.status_code} at offset {offset}: {r.text[:100]}")
                break

            batch = r.json()
            if not batch or not isinstance(batch, list):
                break  # no more data

            all_exercises.extend(batch)
            print(f"  📦 offset={offset:4d} → got {len(batch):2d} | total so far: {len(all_exercises)}", end="\r")

            if len(batch) < BATCH_SIZE:
                break  # last page

            offset += BATCH_SIZE
            time.sleep(DELAY_FETCH)

        except Exception as e:
            print(f"\n  ❌ Request error at offset {offset}: {e}")
            time.sleep(2)
            continue

    print(f"\n\n  ✅ Fetched {len(all_exercises)} exercises total")

    # Save full JSON
    with open(ALL_EXERCISES_FILE, "w", encoding="utf-8") as f:
        json.dump(all_exercises, f, ensure_ascii=False, indent=2)
    print(f"  💾 Saved to {ALL_EXERCISES_FILE}")

    return all_exercises

# ── STEP 2: DOWNLOAD GIF FOR EACH EXERCISE ───────────────────────
def download_gifs(exercises):
    """Download GIF for each exercise using /image endpoint."""
    print(f"\n🎬 Downloading GIFs for {len(exercises)} exercises...")
    print(f"   Already downloaded files will be skipped.\n")

    downloaded = 0
    skipped    = 0
    failed     = 0
    failed_list = []

    for i, ex in enumerate(exercises, 1):
        ex_id = ex.get("id") or ex.get("exerciseId") or ex.get("_id")
        name  = ex.get("name") or f"exercise-{i}"

        if not ex_id:
            skipped += 1
            continue

        filename = f"{safe_name(name)}__{ex_id}.gif"
        out_path = os.path.join(OUT_DIR, filename)

        # Skip if already downloaded and valid
        if os.path.exists(out_path) and os.path.getsize(out_path) > 500:
            skipped += 1
            if i % 100 == 0:
                print(f"  [{i:04d}/{len(exercises)}] ⏭️  {skipped} skipped, {downloaded} downloaded, {failed} failed")
            continue

        # Try gifUrl field first (if available on your plan)
        gif_url = ex.get("gifUrl") or ex.get("gif") or ex.get("image")

        if gif_url and gif_url.startswith("http"):
            # Direct download from gifUrl
            try:
                r = requests.get(gif_url, timeout=30)
                if r.status_code == 200 and len(r.content) > 500:
                    with open(out_path, "wb") as f:
                        f.write(r.content)
                    downloaded += 1
                    size_kb = len(r.content) // 1024
                    print(f"  [{i:04d}/{len(exercises)}] ✅ {name} ({size_kb}KB) [gifUrl]")
                    time.sleep(DELAY_GIF)
                    continue
            except Exception as e:
                pass  # fall through to /image endpoint

        # Try /image endpoint
        try:
            img_url = f"{BASE_URL}/image"
            params  = {"exerciseId": ex_id, "resolution": "360"}
            r = requests.get(img_url, headers=HEADERS, params=params, timeout=30)

            if r.status_code == 429:
                print(f"\n  ⏳ Rate limited — waiting 10 seconds...")
                time.sleep(10)
                # retry
                r = requests.get(img_url, headers=HEADERS, params=params, timeout=30)

            if r.status_code == 200 and r.headers.get("content-type", "").startswith("image/"):
                with open(out_path, "wb") as f:
                    f.write(r.content)
                downloaded += 1
                size_kb = len(r.content) // 1024
                print(f"  [{i:04d}/{len(exercises)}] ✅ {name} ({size_kb}KB) [/image]")
            else:
                # Try alternative: build gifUrl from exercise ID pattern
                # ExerciseDB GIFs follow a predictable URL pattern
                alt_url = f"https://v2.exercisedb.io/image/{ex_id}"
                try:
                    r2 = requests.get(alt_url, timeout=20)
                    if r2.status_code == 200 and len(r2.content) > 500:
                        with open(out_path, "wb") as f:
                            f.write(r2.content)
                        downloaded += 1
                        size_kb = len(r2.content) // 1024
                        print(f"  [{i:04d}/{len(exercises)}] ✅ {name} ({size_kb}KB) [alt-url]")
                    else:
                        print(f"  [{i:04d}/{len(exercises)}] ❌ {name} (id:{ex_id}) — all methods failed")
                        failed += 1
                        failed_list.append({"id": ex_id, "name": name})
                except:
                    print(f"  [{i:04d}/{len(exercises)}] ❌ {name} — network error")
                    failed += 1
                    failed_list.append({"id": ex_id, "name": name})

        except Exception as e:
            print(f"  [{i:04d}/{len(exercises)}] ❌ {name} — {e}")
            failed += 1
            failed_list.append({"id": ex_id, "name": name})

        time.sleep(DELAY_GIF)

    # Save failed list for retry
    if failed_list:
        with open(os.path.join(DATA_DIR, "failed_gifs.json"), "w") as f:
            json.dump(failed_list, f, indent=2)

    return downloaded, skipped, failed

# ── MAIN ─────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  CLASSIC FITNESS — ExerciseDB Full Downloader")
    print("=" * 60)

    # Step 1: Fetch all exercise metadata
    exercises = fetch_all_exercises()

    if not exercises:
        print("\n❌ No exercises fetched. Check your API key and connection.")
        return

    # Quick report on what fields we have
    sample = exercises[0]
    has_gif = any(sample.get(f) for f in ["gifUrl","gif","image"])
    print(f"\n  📊 Sample exercise fields: {list(sample.keys())}")
    print(f"  🎬 Has gifUrl field: {'YES ✅' if has_gif else 'NO — will use /image endpoint'}")

    # Step 2: Download GIFs
    downloaded, skipped, failed = download_gifs(exercises)

    # Final summary
    from pathlib import Path
    total_gifs = len(list(Path(OUT_DIR).glob("*.gif")))

    print("\n" + "=" * 60)
    print(f"  ✅ Downloaded  : {downloaded}")
    print(f"  ⏭️  Skipped    : {skipped} (already existed)")
    print(f"  ❌ Failed      : {failed}")
    print(f"  📁 Total GIFs  : {total_gifs} in {OUT_DIR}/")
    print("=" * 60)

    if failed > 0:
        print(f"\n  ⚠️  {failed} GIFs failed — saved to assets/data/failed_gifs.json")
        print(f"     You can retry just those by running the script again.")

    if total_gifs > 0:
        print(f"\n  ✅ Done! Your exercise library has {total_gifs} GIFs ready.")
        print(f"     Open exercises.html in your browser to see them.")

if __name__ == "__main__":
    main()