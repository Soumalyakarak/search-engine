import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PLATFORM_META = {
  "codeforces.com": {
    label: "Codeforces",
    color: "#3B82F6",
  },

  "leetcode.com": {
    label: "LeetCode",
    color: "#F97316",
  },

  "atcoder.jp": {
    label: "AtCoder",
    color: "#10B981",
  },
};

// Fetch contests for a single platform
const fetchContests = async (resource) => {
  return axios.get("https://clist.by/api/v4/contest/", {
    headers: {
      Authorization: `ApiKey ${process.env.CLIST_USERNAME}:${process.env.CLIST_API_KEY}`,
    },

    params: new URLSearchParams([
      ["format", "json"],
      ["upcoming", "true"],
      ["order_by", "start"],
      ["limit", "20"],
      ["resource", resource],
    ]),

    // Don't let one platform hang the whole request
    timeout: 10000,
  });
};

export const getContests = async (req, res) => {
  try {
    const resources = ["codeforces.com", "leetcode.com", "atcoder.jp"];

    /*
      allSettled is important here.

      If Codeforces succeeds but LeetCode temporarily fails,
      we still return the Codeforces contests.
    */
    const results = await Promise.allSettled(
      resources.map((resource) => fetchContests(resource))
    );

    const successfulResponses = [];
    const failedPlatforms = [];

    results.forEach((result, index) => {
      const resource = resources[index];

      if (result.status === "fulfilled") {
        successfulResponses.push(result.value);
      } else {
        failedPlatforms.push(resource);

        const error = result.reason;

        console.error(`Contest API failed: ${resource}`);
        console.error("Message:", error?.message);
        console.error("Code:", error?.code);
        console.error("Status:", error?.response?.status);
        console.error("Data:", error?.response?.data);
      }
    });

    /*
      If every platform failed, then the endpoint itself has failed.
    */
    if (successfulResponses.length === 0) {
      return res.status(502).json({
        success: false,
        message: "Unable to fetch contests from CLIST",
      });
    }

    /*
      Combine contests from all successful platforms.
    */
    const allObjects = successfulResponses
      .flatMap((response) => response.data?.objects ?? [])
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );

    /*
      Convert CLIST response into the format expected by frontend.
    */
    const contests = allObjects
      .filter(
        (contest) =>
          /^[\x00-\x7F]*$/.test(contest.event) ||
          contest.resource !== "atcoder.jp"
      )
      .map((contest) => ({
        id: contest.id,
        title: contest.event,
        platform: contest.resource,
        label: PLATFORM_META[contest.resource]?.label ?? contest.resource,
        color: PLATFORM_META[contest.resource]?.color ?? "#6B7280",
        start: contest.start,
        end: contest.end,
        duration: contest.duration,
        url: contest.href,
      }));

    return res.json({
      success: true,
      contests,

      // Useful for debugging/monitoring
      ...(failedPlatforms.length > 0 && {
        partial: true,
        failedPlatforms,
      }),
    });
  } catch (error) {
    /*
      This catches unexpected errors outside the individual
      CLIST requests.
    */
    console.error("Contest fetch error:", error?.message);
    console.error("Code:", error?.code);
    console.error("Status:", error?.response?.status);
    console.error("Data:", error?.response?.data);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contests",
    });
  }
};
