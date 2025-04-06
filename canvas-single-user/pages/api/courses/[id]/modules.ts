import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query; // course id from URL
    const { CANVAS_BASE_URL, CANVAS_TOKEN } = process.env;
    if (!id) {
        return res.status(400).json({ error: "Missing course id in query" });
    }
    if (!CANVAS_BASE_URL || !CANVAS_TOKEN) {
        return res.status(500).json({ error: "Missing Canvas config in .env.local" });
    }
    try {
        const url = `${CANVAS_BASE_URL}/api/v1/courses/${id}/modules?include[]=items&include[]=content_details&per_page=100`;
        const fetchResp = await fetch(url, {
            headers: { Authorization: `Bearer ${CANVAS_TOKEN}` },
        });
        if (!fetchResp.ok) {
            const errorText = await fetchResp.text();
            return res.status(fetchResp.status).json({ error: `Canvas error: ${errorText}` });
        }
        const modules = await fetchResp.json();
        return res.status(200).json(modules);
    } catch (error) {
        console.error("Error fetching modules:", error);
        return res.status(500).json({ error: "Server error when fetching modules." });
    }
}
