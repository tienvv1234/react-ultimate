import { useEffect } from "react";

export function useKey (key, callback) {
    useEffect(() => {
        const handler = event => {
            if (event.code.toLowerCase === key.toLowerCase()) {
                callback();
            }
        };

        window.addEventListener("keydown", handler);

        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, [key, callback]);
}