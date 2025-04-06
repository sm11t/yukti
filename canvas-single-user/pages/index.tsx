import React, { useEffect } from "react";
import Link from "next/link";
import { useCourses, Course } from "../context/courseContext";

export default function HomePage() {
    const { courses, setCourses } = useCourses();
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchCourses = async () => {
        if (courses) return;
        try {
            setError(null);
            setIsLoading(true);
            const resp = await fetch("/api/courses");
            if (!resp.ok) {
                const data = await resp.json();
                throw new Error(data.error || "Unknown error");
            }
            const data: Course[] = await resp.json();
            // Filter as needed; for now, we assume you already filter by course code
            const filteredData = data.filter((course) =>
                course.course_code &&
                course.course_code.toLowerCase().startsWith("2025spring")
            );
            setCourses(filteredData);
        } catch (err: any) {
            console.error("Error fetching courses:", err);
            setError(err.message || "Error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!courses) {
            fetchCourses();
        }
    }, [courses]);

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Canvas Single-User Demo</h1>
            <p>This demo uses your manually generated Canvas token.</p>
            {!courses && (
                <button onClick={fetchCourses} disabled={isLoading}>
                    {isLoading ? "Loading..." : "Fetch My Courses"}
                </button>
            )}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {courses && (
                <div style={{ marginTop: "1rem" }}>
                    <h2>My Courses</h2>
                    {courses.map((course) => (
                        <Link key={course.id} href={`/courses/${course.id}`} legacyBehavior>
                            <a
                                style={{
                                    display: "block",
                                    border: "1px solid #ccc",
                                    margin: "1rem 0",
                                    padding: "0.5rem",
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <strong>ID:</strong> {course.id}
                                <br />
                                <strong>Name:</strong> {course.name}
                                <br />
                                <strong>Code:</strong> {course.course_code}
                            </a>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
