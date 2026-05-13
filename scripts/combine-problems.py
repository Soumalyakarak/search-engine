import json
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CF_PATH = os.path.join(BASE_DIR, "data", "raw", "codeforces", "codeforces-problems.json")
LC_PATH = os.path.join(BASE_DIR, "data", "raw", "leetcode", "leetcode-problems.json")

OUTPUT_DIR = os.path.join(BASE_DIR, "data", "corpus")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "all-problems.json")

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def normalize_codeforces(data):
    problems = []
    for p in data.get("problems", []):
        problems.append({
            "id": f"codeforces_{p['id']}",
            "platform": "codeforces",
            "title": p["title"],
            "tags": p.get("tags", []),
            "difficulty": p.get("rating"),  # numeric, OK
            "url": p["url"]
        })
    return problems

def normalize_leetcode(data):
    problems = []
    for p in data.get("problems", []):
        problems.append({
            "id": p["id"],  # already prefixed
            "platform": "leetcode",
            "title": p["title"],
            "tags": p.get("tags", []),
            "difficulty": p.get("difficulty"),
            "url": p["url"]
        })
    return problems

def main():
    cf_data = load_json(CF_PATH)
    lc_data = load_json(LC_PATH)

    cf_problems = normalize_codeforces(cf_data)
    lc_problems = normalize_leetcode(lc_data)

    all_problems = cf_problems + lc_problems

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    output = {
        "generatedAt": datetime.utcnow().isoformat(),
        "totalProblems": len(all_problems),
        "byPlatform": {
            "codeforces": len(cf_problems),
            "leetcode": len(lc_problems)
        },
        "problems": all_problems
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print("Combined problem dataset created")
    print(f"Total problems: {len(all_problems)}")
    print(f"Output: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
