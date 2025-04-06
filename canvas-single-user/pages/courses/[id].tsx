import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type ModuleItem = {
    id: number;
    title: string;
    type: string;
    content_details?: {
        due_at?: string | null;
    };
};

type Module = {
    id: number;
    name: string;
    items: ModuleItem[];
};

export default function CourseDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [modules, setModules] = useState<Module[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;
        const fetchModules = async () => {
            try {
                setLoading(true);
                setError(null);
                const resp = await fetch(`/api/courses/${id}/modules`);
                if (!resp.ok) {
                    const data = await resp.json();
                    throw new Error(data.error || "Error fetching modules");
                }
                const data: Module[] = await resp.json();
                setModules(data);
            } catch (err: any) {
                console.error("Error fetching modules:", err);
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchModules();
    }, [id]);

    if (loading) return <p style={{ padding: "2rem" }}>Loading modules...</p>;
    if (error) return <p style={{ color: "red", padding: "2rem" }}>Error: {error}</p>;

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Course Detail for Course ID: {id}</h1>
            {modules && modules.length === 0 && <p>No modules available for this course.</p>}
            {modules && modules.length > 0 && (
                <div>
                    <h2>Modules</h2>
                    {modules.map((mod) => (
                        <div
                            key={mod.id}
                            style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}
                        >
                            <h3>{mod.name}</h3>
                            {mod.items && mod.items.length > 0 ? (
                                <ul>
                                    {mod.items.map((item) => {
                                        const dueDate = item.content_details?.due_at
                                            ? new Date(item.content_details.due_at).toLocaleString()
                                            : "No due date";
                                        return (
                                            <li key={item.id}>
                                                <strong>{item.title}</strong> ({item.type}) - Due: {dueDate}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p>No items in this module.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
