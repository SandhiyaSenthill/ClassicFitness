"""
redownload_failed.py
Classic Fitness — Fix Only The Failed/Wrong GIFs
=================================================
Run from CF-2/ folder:
  python redownload_failed.py

This script FORCE-REPLACES specific GIFs that came out wrong.
It does NOT touch the good ones (Breathing, Mobility etc.)
"""

import requests
import os
import subprocess
import time

# ── YOUR PEXELS API KEY ───────────────────────────────────────
PEXELS_API_KEY = "ek0Uae4jNkyeQ8LD4sP97anLL1KQPGZ3nXdj7V2YKqtOnXvjwKc4HlLj"
# ─────────────────────────────────────────────────────────────

OUTPUT_DIR = "assets/exercise-gifs/special"
TEMP_DIR   = "assets/exercise-gifs/special/temp_videos"
PEXELS_API = "https://api.pexels.com/videos/search"

# ── ONLY THESE IDs WILL BE RE-DOWNLOADED ─────────────────────
# These are the ones showing wrong content (memes, blood cells,
# muscle diagrams, "content not available")
# Each has multiple very specific queries tried in order
FORCE_REDOWNLOAD = {

    # PRE-PREGNANCY - wrong GIFs
    "sp_pre_001": [
        "pregnant woman yoga pelvic exercise mat",
        "pregnant woman floor yoga gentle",
        "pregnant yoga belly exercise mat",
        "woman prenatal yoga exercise",
    ],
    "sp_pre_002": [
        "pregnant woman yoga floor all fours",
        "pregnant yoga kneeling exercise",
        "prenatal yoga kneeling pose",
        "pregnant woman gentle floor yoga",
    ],
    "sp_pre_003": [
        "pregnant woman yoga lying floor",
        "pregnant woman floor exercise lying",
        "prenatal yoga floor lying",
        "pregnant woman lying yoga pose",
    ],
    "sp_pre_004": [
        "pregnant woman yoga side lying",
        "pregnant yoga lying side",
        "prenatal yoga side exercise",
        "pregnant woman yoga mat side",
    ],
    "sp_pre_005": [
        "pregnant woman standing yoga squat",
        "pregnant woman yoga standing wall",
        "prenatal yoga standing pose",
        "pregnant woman standing exercise yoga",
    ],
    "sp_pre_006": [
        "pregnant woman yoga back stretch",
        "pregnant yoga spine stretch floor",
        "prenatal yoga back exercise",
        "pregnant woman stretching yoga",
    ],
    "sp_pre_007": [
        "pregnant woman yoga breathing belly",
        "pregnant woman breathing exercise",
        "prenatal breathing yoga",
        "pregnant woman meditation breathing",
    ],
    "sp_pre_008": [
        "pregnant woman yoga leg exercise",
        "pregnant woman prenatal leg raise",
        "prenatal yoga leg side exercise",
        "pregnant yoga lying leg",
    ],
    "sp_pre_009": [
        "pregnant woman yoga seated ball",
        "pregnant woman seated exercise yoga",
        "prenatal yoga seated hip",
        "pregnant woman yoga seated pose",
    ],
    "sp_pre_010": [
        "pregnant woman yoga arm shoulder",
        "pregnant woman upper body yoga",
        "prenatal yoga arms exercise",
        "pregnant woman yoga shoulder",
    ],

    # POST-PREGNANCY - some may be wrong too
    "sp_post_001": [
        "woman yoga lying breathing floor",
        "woman yoga floor breathing relax",
        "woman yoga lying relaxation",
        "woman yoga mat breathing",
    ],
    "sp_post_002": [
        "woman yoga core floor exercise",
        "woman yoga lying leg exercise",
        "woman yoga floor core workout",
        "woman fitness yoga mat lying",
    ],
    "sp_post_003": [
        "woman yoga glute bridge floor",
        "woman yoga hip lift lying",
        "woman fitness bridge exercise mat",
        "woman yoga floor hip exercise",
    ],
    "sp_post_004": [
        "woman yoga floor balance exercise",
        "woman yoga mat stability exercise",
        "woman fitness floor balance",
        "woman yoga kneeling balance",
    ],
    "sp_post_006": [
        "woman yoga side lying leg",
        "woman fitness side lying exercise",
        "woman yoga mat side leg lift",
        "woman side lying fitness exercise",
    ],
    "sp_post_008": [
        "woman yoga kneeling floor exercise",
        "woman yoga all fours exercise",
        "woman fitness kneeling exercise",
        "woman yoga floor balance pose",
    ],

    # MOBILITY - any that came out wrong
    "sp_mob_001": [
        "woman yoga hip rotation standing",
        "woman fitness hip exercise standing",
        "woman yoga hip circle standing",
        "woman yoga hip warm up",
    ],
    "sp_mob_003": [
        "woman yoga seated ankle stretch",
        "woman fitness ankle exercise",
        "woman yoga foot ankle rotation",
        "woman yoga seated foot exercise",
    ],
    "sp_mob_007": [
        "woman yoga seated hip stretch floor",
        "woman yoga floor hip opening",
        "woman yoga hip floor pose",
        "woman yoga seated hip opening",
    ],

    # STRETCHING - any that came out wrong
    "sp_str_001": [
        "woman yoga seated forward fold",
        "woman yoga hamstring stretch mat",
        "woman fitness forward bend yoga",
        "woman yoga floor stretch forward",
    ],
    "sp_str_004": [
        "woman yoga cobra lying pose",
        "woman yoga back extension floor",
        "woman yoga lying backbend",
        "woman yoga floor back stretch",
    ],
    "sp_str_005": [
        "woman yoga child pose mat",
        "woman yoga rest pose floor",
        "woman yoga child resting pose",
        "woman yoga floor rest stretch",
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
                if dur > 12:
                    continue
                files = video.get("video_files", [])
                sd = [f for f in files if f.get("quality") in ["sd","hd"]
                      and f.get("width", 9999) <= 1280]
                if not sd:
                    sd = [f for f in files if f.get("quality") == "sd"]
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
                for chunk in r.iter_content(8192):
                    f.write(chunk)
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
            if r.returncode == 0:
                return True

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
print("  Fix Failed GIFs — Targeted Re-download")
print("=" * 60)

if PEXELS_API_KEY == "YOUR_PEXELS_API_KEY":
    print("❌ Add your Pexels API key first!")
    exit(1)

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR,   exist_ok=True)

ok = fail = 0

for sid, queries in FORCE_REDOWNLOAD.items():
    gif   = os.path.join(OUTPUT_DIR, f"{sid}.gif")
    video = os.path.join(TEMP_DIR,   f"{sid}.mp4")

    print(f"\n🔄 {sid}")

    # Delete old wrong GIF
    if os.path.exists(gif):
        os.remove(gif)
        print(f"  🗑  Deleted old GIF")

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
print(f"  ✅ Fixed : {ok}")
print(f"  ❌ Failed: {fail}")
print(f"  📁 GIFs  : {OUTPUT_DIR}/")
print(f"{'='*60}")
