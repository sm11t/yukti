// pages/_app.tsx
import type { AppProps } from "next/app";
import { CourseProvider } from "../context/courseContext";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <CourseProvider>
            <Component {...pageProps} />
        </CourseProvider>
    );
}

export default MyApp;
