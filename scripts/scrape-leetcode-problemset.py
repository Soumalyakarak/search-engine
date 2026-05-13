import requests
import json
import os
from datetime import datetime

def scrape_leetcode():
    url = "https://leetcode.com/api/problems/all/"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers, timeout=20)
    response.raise_for_status()
    data = response.json()

    problems = []

    for item in data.get("stat_status_pairs", []):
        stat = item.get("stat", {})
        difficulty_level = item.get("difficulty", {}).get("level")

        if not stat or not difficulty_level:
            continue

        difficulty = ["Easy", "Medium", "Hard"][difficulty_level - 1]

        problems.append({
            "id": f"leetcode_{stat['question__title_slug']}",
            "platform": "leetcode",
            "title": stat["question__title"],
            "tags": [],  # not available in this endpoint
            "difficulty": difficulty,
            "url": f"https://leetcode.com/problems/{stat['question__title_slug']}/"
        })

    output = {
        "platform": "leetcode",
        "scrapedAt": datetime.utcnow().isoformat(),
        "totalProblems": len(problems),
        "problems": problems
    }

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    output_dir = os.path.join(BASE_DIR, "data", "raw", "leetcode")
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, "leetcode-problems.json")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"Saved {len(problems)} LeetCode problems")
    print(f"Output: {output_path}")

if __name__ == "__main__":
    scrape_leetcode()
