"""
download_women_gifs.py  (v3 - IMPROVED QUERIES)
Classic Fitness — Women's Exercise GIF Creator
================================================
BEFORE RUNNING:
  1. Delete old GIFs first:
     PowerShell: Remove-Item "assets\exercise-gifs\special\*.gif" -Force

  2. Make sure your Pexels API key is set below

  3. Run from CF-2/ folder:
     python download_women_gifs.py
"""

import requests
import os
import subprocess
import time
import json

# ── PASTE YOUR PEXELS API KEY HERE ───────────────────────────
PEXELS_API_KEY = "ek0Uae4jNkyeQ8LD4sP97anLL1KQPGZ3nXdj7V2YKqtOnXvjwKc4HlLj"
# ─────────────────────────────────────────────────────────────

OUTPUT_DIR = "assets/exercise-gifs/special"
TEMP_DIR   = "assets/exercise-gifs/special/temp_videos"
PEXELS_API = "https://api.pexels.com/videos/search"

# ── IMPROVED SEARCH QUERIES ───────────────────────────────────
# Strategy: use very specific women-only queries
# Each has 3 fallback queries tried in order until a video is found
EXERCISE_SEARCHES = {

    # ── MOBILITY ─────────────────────────────────────────────
    "sp_mob_001": [
        "woman yoga hip rotation exercise",
        "woman hip mobility workout",
        "woman yoga warm up exercise mat"
    ],
    "sp_mob_002": [
        "woman yoga floor stretch exercise",
        "woman stretching exercise mat",
        "woman yoga pose mat exercise"
    ],
    "sp_mob_003": [
        "woman ankle stretch yoga",
        "woman foot stretch exercise seated",
        "woman yoga seated stretch mat"
    ],
    "sp_mob_004": [
        "woman yoga back rotation stretch",
        "woman yoga spine twist exercise",
        "woman yoga back exercise mat"
    ],
    "sp_mob_005": [
        "woman cat cow yoga pose",
        "woman yoga all fours exercise",
        "woman yoga floor pose stretching"
    ],
    "sp_mob_006": [
        "woman shoulder stretch yoga",
        "woman arm rotation exercise yoga",
        "woman yoga shoulder mobility"
    ],
    "sp_mob_007": [
        "woman yoga hip stretch floor",
        "woman seated hip stretch yoga",
        "woman yoga hip opening pose"
    ],
    "sp_mob_008": [
        "woman yoga wrist stretch",
        "woman yoga hand stretch exercise",
        "woman yoga seated wrist"
    ],
    "sp_mob_009": [
        "woman yoga forward fold stretch",
        "woman yoga bending stretch exercise",
        "woman yoga floor stretch warm up"
    ],
    "sp_mob_010": [
        "woman yoga deep squat pose",
        "woman yoga squat exercise mat",
        "woman yoga low squat stretch"
    ],

    # ── STRETCHING ───────────────────────────────────────────
    "sp_str_001": [
        "woman yoga forward fold hamstring",
        "woman stretching legs yoga mat",
        "woman yoga seated forward bend"
    ],
    "sp_str_002": [
        "woman standing quad stretch balance",
        "woman yoga standing leg stretch",
        "woman fitness standing stretch leg"
    ],
    "sp_str_003": [
        "woman yoga lunge hip stretch",
        "woman yoga low lunge pose",
        "woman yoga hip flexor stretch"
    ],
    "sp_str_004": [
        "woman yoga cobra pose",
        "woman yoga backbend floor pose",
        "woman yoga lying back stretch"
    ],
    "sp_str_005": [
        "woman yoga child pose",
        "woman yoga resting pose mat",
        "woman yoga floor relaxing pose"
    ],
    "sp_str_006": [
        "woman yoga pigeon pose",
        "woman yoga hip opening floor",
        "woman yoga deep hip stretch"
    ],
    "sp_str_007": [
        "woman yoga chest stretch arms",
        "woman yoga chest opening pose",
        "woman yoga shoulder chest stretch"
    ],
    "sp_str_008": [
        "woman yoga seated twist pose",
        "woman yoga spinal twist seated",
        "woman yoga seated rotation stretch"
    ],
    "sp_str_009": [
        "woman calf stretch yoga wall",
        "woman yoga leg stretch standing",
        "woman yoga standing calf stretch"
    ],
    "sp_str_010": [
        "woman yoga butterfly pose seated",
        "woman yoga seated inner thigh stretch",
        "woman yoga seated groin stretch"
    ],

    # ── PRE-PREGNANCY ─────────────────────────────────────────
    "sp_pre_001": [
        "pregnant woman yoga exercise mat",
        "pregnant woman prenatal yoga",
        "pregnancy yoga workout exercise"
    ],
    "sp_pre_002": [
        "pregnant woman prenatal yoga floor",
        "pregnant woman gentle yoga exercise",
        "pregnancy workout gentle yoga"
    ],
    "sp_pre_003": [
        "pregnant woman yoga lying exercise",
        "pregnant woman floor exercise yoga",
        "prenatal yoga floor lying down"
    ],
    "sp_pre_004": [
        "pregnant woman side lying yoga",
        "pregnant woman yoga side stretch",
        "pregnancy yoga side lying exercise"
    ],
    "sp_pre_005": [
        "pregnant woman wall yoga squat",
        "pregnant woman standing yoga exercise",
        "pregnancy standing yoga workout"
    ],
    "sp_pre_006": [
        "pregnant woman yoga back stretch",
        "pregnant woman prenatal yoga spine",
        "pregnancy yoga gentle back exercise"
    ],
    "sp_pre_007": [
        "pregnant woman breathing yoga meditation",
        "pregnant woman prenatal breathing",
        "pregnancy breathing exercise yoga"
    ],
    "sp_pre_008": [
        "pregnant woman yoga leg exercise",
        "pregnant woman lying yoga leg lift",
        "prenatal yoga leg exercise floor"
    ],
    "sp_pre_009": [
        "pregnant woman yoga seated exercise",
        "pregnant woman prenatal yoga seated",
        "pregnancy yoga sitting exercise"
    ],
    "sp_pre_010": [
        "pregnant woman yoga arm exercise",
        "pregnant woman prenatal upper body",
        "pregnancy yoga arms shoulders"
    ],

    # ── POST-PREGNANCY ────────────────────────────────────────
    "sp_post_001": [
        "woman yoga breathing exercise floor",
        "woman yoga lying breathing meditation",
        "woman yoga relaxation breathing mat"
    ],
    "sp_post_002": [
        "woman yoga core exercise floor",
        "woman yoga abdominal exercise mat",
        "woman yoga lying core workout"
    ],
    "sp_post_003": [
        "woman glute bridge exercise yoga mat",
        "woman yoga lying hip lift exercise",
        "woman yoga floor hip exercise"
    ],
    "sp_post_004": [
        "woman yoga core stability floor",
        "woman yoga lying leg arm exercise",
        "woman yoga floor balance exercise"
    ],
    "sp_post_005": [
        "woman wall push up exercise home",
        "woman home workout push up wall",
        "woman fitness wall exercise push"
    ],
    "sp_post_006": [
        "woman yoga side lying leg lift",
        "woman yoga side lying exercise mat",
        "woman yoga lying side leg raise"
    ],
    "sp_post_007": [
        "woman yoga resistance band exercise",
        "woman fitness band exercise seated",
        "woman yoga seated band workout"
    ],
    "sp_post_008": [
        "woman yoga floor balance exercise",
        "woman yoga kneeling exercise mat",
        "woman yoga all fours balance"
    ],
    "sp_post_009": [
        "woman yoga seated breathing meditation",
        "woman meditation yoga seated calm",
        "woman yoga floor seated meditation"
    ],
    "sp_post_010": [
        "woman yoga lying leg raise",
        "woman fitness side lying leg exercise",
        "woman yoga side leg lift mat"
    ],

    # ── BREATHING ─────────────────────────────────────────────
    "sp_bth_001": [
        "woman meditation breathing yoga seated",
        "woman yoga breathing exercise calm",
        "woman seated meditation deep breath"
    ],
    "sp_bth_002": [
        "woman yoga deep breathing relax",
        "woman meditation breathing exercise",
        "woman yoga calm breathing seated"
    ],
    "sp_bth_003": [
        "woman yoga belly breathing exercise",
        "woman lying yoga deep breathing",
        "woman yoga floor breathing relax"
    ],
    "sp_bth_004": [
        "woman yoga meditation breathing nose",
        "woman yoga pranayama breathing",
        "woman yoga nostril breathing seated"
    ],
    "sp_bth_005": [
        "woman yoga breathing calm meditation",
        "woman yoga slow breathing exercise",
        "woman meditation peaceful breathing"
    ],
    "sp_bth_006": [
        "woman yoga breathing exercise pose",
        "woman yoga open mouth breathing",
        "woman yoga seated breathing yoga"
    ],
    "sp_bth_007": [
        "woman yoga ocean breathing meditation",
        "woman yoga pranayama breathing calm",
        "woman meditation yoga peaceful"
    ],
    "sp_bth_008": [
        "woman yoga vigorous breathing exercise",
        "woman yoga energetic breathing",
        "woman yoga kapalabhati exercise"
    ],
    "sp_bth_009": [
        "woman yoga slow exhale breathing",
        "woman yoga relaxed breathing calm",
        "woman yoga breathing relaxation"
    ],
    "sp_bth_010": [
        "woman yoga meditation coherent breathing",
        "woman yoga peaceful meditation seated",
        "woman yoga calm meditation breathing"
    ],
}


def search_pexels_video(queries):
    """Try multiple queries until we find a good video with a woman"""
    headers = {"Authorization": PEXELS_API_KEY}

    for query in queries:
        params = {
            "query":    query,
            "per_page": 8,
            "size":     "medium",
        }
        try:
            r = requests.get(PEXELS_API, headers=headers, params=params, timeout=10)
            if r.status_code == 401:
                print("\n❌ INVALID API KEY — check PEXELS_API_KEY above")
                return None
            if r.status_code != 200:
                continue

            videos = r.json().get("videos", [])
            for video in videos:
                duration = video.get("duration", 99)
                if duration > 10:
                    continue
                files = video.get("video_files", [])
                # prefer SD/HD under 1280px wide
                good = [f for f in files if f.get("quality") in ["sd","hd"]
                        and f.get("width", 9999) <= 1280]
                if not good:
                    good = [f for f in files if f.get("quality") == "sd"]
                if not good and files:
                    good = files

                if good:
                    good.sort(key=lambda x: x.get("width", 0))
                    return {
                        "url":       good[0]["link"],
                        "duration":  min(duration, 5),
                        "pexels_id": video.get("id"),
                        "author":    video.get("user", {}).get("name", "Unknown"),
                        "query":     query,
                    }
        except Exception as e:
            print(f"  Search error ({query}): {e}")
            continue

    return None


def download_video(url, filepath):
    try:
        r = requests.get(url, stream=True, timeout=30)
        if r.status_code == 200:
            with open(filepath, "wb") as f:
                for chunk in r.iter_content(8192):
                    f.write(chunk)
            return True
    except Exception as e:
        print(f"  Download error: {e}")
    return False


def video_to_gif(video_path, gif_path, duration=4):
    try:
        palette = gif_path.replace(".gif", "_pal.png")
        # Step 1 — palette
        r1 = subprocess.run([
            "ffmpeg", "-y", "-ss", "0", "-t", str(duration), "-i", video_path,
            "-vf", "fps=10,scale=320:-1:flags=lanczos,palettegen=stats_mode=diff",
            palette, "-loglevel", "error"
        ], capture_output=True)

        if r1.returncode == 0:
            # Step 2 — gif with palette
            r2 = subprocess.run([
                "ffmpeg", "-y", "-ss", "0", "-t", str(duration),
                "-i", video_path, "-i", palette,
                "-lavfi", "fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer",
                "-loop", "0", gif_path, "-loglevel", "error"
            ], capture_output=True)
            if os.path.exists(palette): os.remove(palette)
            if r2.returncode == 0: return True

        # Fallback — simple conversion
        r3 = subprocess.run([
            "ffmpeg", "-y", "-ss", "0", "-t", str(duration), "-i", video_path,
            "-vf", "fps=10,scale=320:-1", "-loop", "0",
            gif_path, "-loglevel", "error"
        ], capture_output=True)
        return r3.returncode == 0

    except FileNotFoundError:
        print("\n❌ ffmpeg not found — run: winget install ffmpeg")
        return False


def check_ffmpeg():
    try:
        return subprocess.run(["ffmpeg", "-version"],
                              capture_output=True).returncode == 0
    except FileNotFoundError:
        return False


# ── MAIN ─────────────────────────────────────────────────────
print("=" * 62)
print("  Classic Fitness — Women's Exercise GIF Creator v3")
print("=" * 62)

if PEXELS_API_KEY == "YOUR_PEXELS_API_KEY":
    print("\n❌ Add your Pexels API key first!")
    print("   https://www.pexels.com/api/")
    exit(1)

if not check_ffmpeg():
    print("❌ ffmpeg not found — run: winget install ffmpeg")
    exit(1)

print("✅ ffmpeg ready\n")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR,   exist_ok=True)

success = failed = skipped = 0
credits = []
total   = len(EXERCISE_SEARCHES)

for i, (special_id, queries) in enumerate(EXERCISE_SEARCHES.items(), 1):
    gif_path   = os.path.join(OUTPUT_DIR, f"{special_id}.gif")
    video_path = os.path.join(TEMP_DIR,   f"{special_id}.mp4")

    print(f"[{i:02d}/{total}] {special_id}")

    if os.path.exists(gif_path) and os.path.getsize(gif_path) > 5000:
        print(f"  ✅ Already done — skipping")
        skipped += 1
        continue

    print(f"  🔍 Searching Pexels...")
    info = search_pexels_video(queries)

    if not info:
        print(f"  ❌ No video found")
        failed += 1
        continue

    print(f"  📥 Downloading: '{info['query']}' by {info['author']} ({info['duration']}s)")
    if not download_video(info["url"], video_path):
        print(f"  ❌ Download failed")
        failed += 1
        continue

    print(f"  🎬 Converting to GIF...")
    if video_to_gif(video_path, gif_path, info["duration"]):
        size_kb = os.path.getsize(gif_path) // 1024
        print(f"  ✅ Done! {size_kb}KB")
        success += 1
        credits.append({
            "id": special_id,
            "author": info["author"],
            "pexels_id": info["pexels_id"],
            "url": f"https://www.pexels.com/video/{info['pexels_id']}/"
        })
        if os.path.exists(video_path): os.remove(video_path)
    else:
        print(f"  ❌ GIF conversion failed")
        failed += 1

    time.sleep(0.4)

# Save credits
with open(os.path.join(OUTPUT_DIR, "pexels_credits.json"), "w") as f:
    json.dump(credits, f, indent=2)

try:
    import shutil
    if os.path.exists(TEMP_DIR) and not os.listdir(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
except: pass

print("\n" + "=" * 62)
print(f"  ✅ Created  : {success} women GIFs")
print(f"  ⏭️  Skipped  : {skipped}")
print(f"  ❌ Failed   : {failed}")
print(f"\n  📁 GIFs in  : {OUTPUT_DIR}/")
print("  ⚠️  Add 'Videos by Pexels.com' to your footer")
print("=" * 62)