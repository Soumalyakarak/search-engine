import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PLATFORM_META = {
  "codeforces.com": { label: "Codeforces", color: "#3B82F6" },
  "leetcode.com":   { label: "LeetCode",   color: "#F97316" },
  "atcoder.jp":     { label: "AtCoder",    color: "#10B981" },
};

export const getContests = async (req, res) => {
  try {
    const [cfRes, lcRes, atRes] = await Promise.all([
      axios.get("https://clist.by/api/v4/contest/", {
        headers: { "Authorization": `ApiKey ${process.env.CLIST_USERNAME}:${process.env.CLIST_API_KEY}` },
        params: new URLSearchParams([["format","json"],["upcoming","true"],["order_by","start"],["limit","20"],["resource","codeforces.com"]]),
      }),
      axios.get("https://clist.by/api/v4/contest/", {
        headers: { "Authorization": `ApiKey ${process.env.CLIST_USERNAME}:${process.env.CLIST_API_KEY}` },
        params: new URLSearchParams([["format","json"],["upcoming","true"],["order_by","start"],["limit","20"],["resource","leetcode.com"]]),
      }),
      axios.get("https://clist.by/api/v4/contest/", {
        headers: { "Authorization": `ApiKey ${process.env.CLIST_USERNAME}:${process.env.CLIST_API_KEY}` },
        params: new URLSearchParams([["format","json"],["upcoming","true"],["order_by","start"],["limit","20"],["resource","atcoder.jp"]]),
      }),
    ]);

    const allObjects = [
      ...(cfRes.data.objects ?? []),
      ...(lcRes.data.objects ?? []),
      ...(atRes.data.objects ?? []),
    ].sort((a, b) => new Date(a.start) - new Date(b.start));

    const contests = allObjects
      .filter((c) => /^[\x00-\x7F]*$/.test(c.event) || c.resource !== "atcoder.jp")
      .map((c) => ({
        id:       c.id,
        title:    c.event,
        platform: c.resource,
        label:    PLATFORM_META[c.resource]?.label ?? c.resource,
        color:    PLATFORM_META[c.resource]?.color ?? "#6B7280",
        start:    c.start,
        end:      c.end,
        duration: c.duration,
        url:      c.href,
      }));

    res.json({ success: true, contests });
  } catch (error) {
    console.error("Contest fetch error:", error?.response?.status, error?.response?.data);
    res.status(500).json({ success: false, message: "Failed to fetch contests" });
  }
};