"""
download_new_exercises.py
Downloads GIFs only for the NEW exercises added
(sp_bth_011 to sp_bth_020, sp_mob_011-015, sp_str_011-015)

Run from CF-2/ folder:
  python download_new_exercises.py
"""

import requests, os, subprocess, time

PEXELS_API_KEY = "ek0Uae4jNkyeQ8LD4sP97anLL1KQPGZ3nXdj7V2YKqtOnXvjwKc4HlLj"

OUTPUT_DIR = "assets/exercise-gifs/special"
TEMP_DIR   = "assets/exercise-gifs/special/temp_videos"
PEXELS_API = "https://api.pexels.com/videos/search"

# Unique queries — each exercise gets completely different search terms
# so no two GIFs will look the same
NEW_EXERCISES = {

    # ── NEW BREATHING (all unique search terms) ───────────────
    "sp_bth_011": [
        "woman yoga sitali cooling breath tongue",
        "woman yoga rolling tongue breathing",
        "woman yoga cooling breathing pose seated",
    ],
    "sp_bth_012": [
        "woman humming meditation yoga seated",
        "woman yoga bee breath humming",
        "woman yoga sound meditation seated",
    ],
    "sp_bth_013": [
        "woman yoga advanced pranayama breathing",
        "woman yoga hand nose breathing alternate",
        "woman yoga mudra breathing seated",
    ],
    "sp_bth_014": [
        "woman yoga three part breathing lying",
        "woman yoga full breath lying mat",
        "woman yoga lying down deep breathing",
    ],
    "sp_bth_015": [
        "woman yoga power breathing lying floor",
        "woman yoga wim hof style breathing",
        "woman yoga energetic breathing lying",
    ],
    "sp_bth_016": [
        "woman yoga triangle breathing eyes closed",
        "woman yoga equal breathing meditation",
        "woman yoga balanced breath seated calm",
    ],
    "sp_bth_017": [
        "woman yoga fire breath rapid kundalini",
        "woman yoga fast breathing exercise",
        "woman yoga rhythmic breathing seated",
    ],
    "sp_bth_018": [
        "woman morning yoga stretching arms up",
        "woman yoga morning energising stretch",
        "woman yoga morning exercise arms overhead",
    ],
    "sp_bth_019": [
        "woman yoga pre workout breathing standing",
        "woman yoga power standing breathing",
        "woman yoga standing energising breath",
    ],
    "sp_bth_020": [
        "woman yoga post workout lying recovery",
        "woman yoga cool down lying floor",
        "woman yoga recovery breathing floor mat",
    ],

    # ── NEW MOBILITY ──────────────────────────────────────────
    "sp_mob_011": [
        "woman yoga lizard pose hip lunge",
        "woman yoga deep lunge hip stretch",
        "woman yoga low lunge floor hip",
    ],
    "sp_mob_012": [
        "woman yoga thread needle shoulder back",
        "woman yoga upper back twist floor",
        "woman yoga shoulder release floor pose",
    ],
    "sp_mob_013": [
        "woman yoga standing figure four stretch",
        "woman yoga standing hip rotation balance",
        "woman yoga standing single leg stretch",
    ],
    "sp_mob_014": [
        "woman yoga neck stretch seated gentle",
        "woman yoga neck roll seated exercise",
        "woman yoga cervical stretch seated",
    ],
    "sp_mob_015": [
        "woman yoga half kneeling hip stretch",
        "woman yoga kneeling lunge hip flex",
        "woman yoga kneeling pose hip stretch",
    ],

    # ── NEW STRETCHING ────────────────────────────────────────
    "sp_str_011": [
        "woman yoga shoulder doorway chest stretch",
        "woman yoga chest opening arms stretch",
        "woman yoga open chest shoulder stretch",
    ],
    "sp_str_012": [
        "woman yoga lying twist IT band stretch",
        "woman yoga supine twist lying mat",
        "woman yoga lying cross body stretch",
    ],
    "sp_str_013": [
        "woman yoga standing side bend stretch",
        "woman yoga lateral stretch standing arms",
        "woman yoga side body stretch standing",
    ],
    "sp_str_014": [
        "woman yoga lying prone quad stretch",
        "woman yoga lying face down leg stretch",
        "woman yoga prone back leg stretch",
    ],
    "sp_str_015": [
        "woman yoga kneeling wall hip stretch",
        "woman yoga supported hip flexor stretch",
        "woman yoga wall kneeling stretch pose",
    ],
}


def search_pexels(queries):
    headers = {"Authorization": PEXELS_API_KEY}
    for query in queries:
        try:
            r = requests.get(PEXELS_API, headers=headers,
                             params={"query": query, "per_page": 10,
                                     "size": "medium"}, timeout=10)
            if r.status_code == 401:
                print("\n❌ Invalid API key!")
                return None
            if r.status_code != 200:
                continue
            for video in r.json().get("videos", []):
                dur = video.get("duration", 99)
                if dur > 12: continue
                files = video.get("video_files", [])
                sd = [f for f in files if f.get("quality") in ["sd","hd"]
                      and f.get("width", 9999) <= 1280]
                if not sd: sd = [f for f in files if f.get("quality") == "sd"]
                if sd:
                    sd.sort(key=lambda x: x.get("width", 0))
                    return {
                        "url":    sd[0]["link"],
                        "dur":    min(dur, 5),
                        "author": video.get("user", {}).get("name", "?"),
                        "id":     video.get("id"),
                        "query":  query,
                    }
        except Exception as e:
            continue
    return None


def download_video(url, path):
    try:
        r = requests.get(url, stream=True, timeout=30)
        if r.status_code == 200:
            with open(path, "wb") as f:
                for chunk in r.iter_content(8192): f.write(chunk)
            return True
    except: pass
    return False


def to_gif(video, gif, dur):
    try:
        pal = gif.replace(".gif", "_pal.png")
        subprocess.run([
            "ffmpeg", "-y", "-ss", "0", "-t", str(dur), "-i", video,
            "-vf", "fps=10,scale=320:-1:flags=lanczos,palettegen",
            pal, "-loglevel", "error"
        ], capture_output=True)
        if os.path.exists(pal):
            r = subprocess.run([
                "ffmpeg", "-y", "-ss", "0", "-t", str(dur),
                "-i", video, "-i", pal,
                "-lavfi", "fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse",
                "-loop", "0", gif, "-loglevel", "error"
            ], capture_output=True)
            os.remove(pal)
            if r.returncode == 0: return True
        r2 = subprocess.run([
            "ffmpeg", "-y", "-ss", "0", "-t", str(dur), "-i", video,
            "-vf", "fps=10,scale=320:-1", "-loop", "0",
            gif, "-loglevel", "error"
        ], capture_output=True)
        return r2.returncode == 0
    except FileNotFoundError:
        print("❌ ffmpeg not found")
        return False


# ── MAIN ─────────────────────────────────────────────────────
print("=" * 60)
print("  Download New Exercise GIFs")
print("=" * 60)

if PEXELS_API_KEY == "YOUR_PEXELS_API_KEY":
    print("❌ Add your Pexels API key!")
    exit(1)

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR,   exist_ok=True)

ok = fail = skip = 0
total = len(NEW_EXERCISES)

for i, (sid, queries) in enumerate(NEW_EXERCISES.items(), 1):
    gif   = os.path.join(OUTPUT_DIR, f"{sid}.gif")
    video = os.path.join(TEMP_DIR,   f"{sid}.mp4")

    print(f"\n[{i:02d}/{total}] {sid}")

    if os.path.exists(gif) and os.path.getsize(gif) > 5000:
        print(f"  ✅ Already done")
        skip += 1
        continue

    info = search_pexels(queries)
    if not info:
        print(f"  ❌ No video found")
        fail += 1
        continue

    print(f"  📥 '{info['query']}' by {info['author']}")
    if not download_video(info["url"], video):
        print(f"  ❌ Download failed")
        fail += 1
        continue

    print(f"  🎬 Converting...")
    if to_gif(video, gif, info["dur"]):
        kb = os.path.getsize(gif) // 1024
        print(f"  ✅ {kb}KB")
        ok += 1
        if os.path.exists(video): os.remove(video)
    else:
        print(f"  ❌ Conversion failed")
        fail += 1

    time.sleep(0.4)

print(f"\n{'='*60}")
print(f"  ✅ Created : {ok}")
print(f"  ⏭️  Skipped : {skip}")
print(f"  ❌ Failed  : {fail}")
print(f"  📁 GIFs in : {OUTPUT_DIR}/")
print(f"{'='*60}")
