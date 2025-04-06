// pages/api/courses.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { CANVAS_BASE_URL, CANVAS_TOKEN } = process.env;

    if (!CANVAS_BASE_URL || !CANVAS_TOKEN) {
        return res.status(500).json({ error: "Missing Canvas config in .env.local" });
    }

    try {
        // Adjust query parameters (e.g., state[]=available, per_page=100) if desired
        const url = `${CANVAS_BASE_URL}/api/v1/courses?per_page=100`;

        const fetchResp = await fetch(url, {
            headers: {
                Authorization: `Bearer ${CANVAS_TOKEN}`,
            },
        });

        if (!fetchResp.ok) {
            const errorText = await fetchResp.text();
            return res.status(fetchResp.status).json({ error: `Canvas error: ${errorText}` });
        }

        const courses = await fetchResp.json();
        return res.status(200).json(courses);
    } catch (error) {
        console.error("Canvas fetch error:", error);
        return res.status(500).json({ error: "Server error when fetching courses." });
    }
}
