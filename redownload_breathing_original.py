"""
redownload_breathing_original.py
Re-downloads sp_bth_001 to sp_bth_010 with unique queries
Each has completely different search terms — no repeats

Run from CF-2/ folder:
  python redownload_breathing_original.py
"""

import requests, os, subprocess, time

PEXELS_API_KEY = "ek0Uae4jNkyeQ8LD4sP97anLL1KQPGZ3nXdj7V2YKqtOnXvjwKc4HlLj"

OUTPUT_DIR = "assets/exercise-gifs/special"
TEMP_DIR   = "assets/exercise-gifs/special/temp_videos"
PEXELS_API = "https://api.pexels.com/videos/search"

# Completely unique queries for each — no overlap with each other
BREATHING_ORIGINAL = {
    "sp_bth_001": [
        "woman yoga box breathing seated eyes closed",
        "woman yoga seated calm meditation",
        "woman yoga cross legged breathing meditation",
    ],
    "sp_bth_002": [
        "woman yoga lying relaxed deep breathing floor",
        "woman yoga savasana breathing relaxation",
        "woman yoga lying floor eyes closed calm",
    ],
    "sp_bth_003": [
        "woman yoga belly breathing hands stomach lying",
        "woman yoga diaphragm breathing lying mat",
        "woman yoga abdominal breathing floor mat",
    ],
    "sp_bth_004": [
        "woman yoga finger nose alternate nostril",
        "woman yoga nadi shodhana nostril exercise",
        "woman yoga pranayama hand nose seated",
    ],
    "sp_bth_005": [
        "woman yoga pursed lip slow breathing",
        "woman yoga exhale slow lips seated",
        "woman yoga slow mindful breathing seated",
    ],
    "sp_bth_006": [
        "woman yoga lion pose open mouth exhale",
        "woman yoga face tension release breath",
        "woman yoga expressive breathing face open",
    ],
    "sp_bth_007": [
        "woman yoga ocean sound breathing ujjayi",
        "woman yoga throat sound meditation breathing",
        "woman yoga ocean breathing pose eyes closed",
    ],
    "sp_bth_008": [
        "woman yoga rapid forceful breathing seated",
        "woman yoga kapalabhati belly pump breath",
        "woman yoga fast rhythmic belly breathing",
    ],
    "sp_bth_009": [
        "woman yoga slow exhale lying peaceful",
        "woman yoga long exhale relaxation lying",
        "woman yoga extended exhale breathing mat",
    ],
    "sp_bth_010": [
        "woman yoga coherent slow rhythm breathing",
        "woman meditation slow breathing peaceful outdoor",
        "woman yoga nature outdoor meditation breath",
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
                sd = [f for f in files if f.get("quality") in ["sd", "hd"]
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
    except:
        pass
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
print("  Re-download Original Breathing GIFs (sp_bth_001-010)")
print("=" * 60)

if PEXELS_API_KEY == "YOUR_PEXELS_API_KEY":
    print("❌ Add your Pexels API key!")
    exit(1)

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR,   exist_ok=True)

ok = fail = 0
total = len(BREATHING_ORIGINAL)

for i, (sid, queries) in enumerate(BREATHING_ORIGINAL.items(), 1):
    gif   = os.path.join(OUTPUT_DIR, f"{sid}.gif")
    video = os.path.join(TEMP_DIR,   f"{sid}.mp4")

    print(f"\n[{i:02d}/{total}] {sid}")

    # Force delete old GIF
    if os.path.exists(gif):
        os.remove(gif)
        print(f"  🗑  Deleted old GIF")

    info = search_pexels(queries)
    if not info:
        print(f"  ❌ No video found")
        fail += 1
        continue

    print(f"  📥 '{info['query']}' by {info['author']} ({info['dur']}s)")
    if not download_video(info["url"], video):
        print(f"  ❌ Download failed")
        fail += 1
        continue

    print(f"  🎬 Converting...")
    if to_gif(video, gif, info["dur"]):
        kb = os.path.getsize(gif) // 1024
        print(f"  ✅ {kb}KB")
        ok += 1
        if os.path.exists(video):
            os.remove(video)
    else:
        print(f"  ❌ Conversion failed")
        fail += 1

    time.sleep(0.5)

print(f"\n{'='*60}")
print(f"  ✅ Fixed  : {ok}")
print(f"  ❌ Failed : {fail}")
print(f"  📁 GIFs   : {OUTPUT_DIR}/")
print(f"{'='*60}")
