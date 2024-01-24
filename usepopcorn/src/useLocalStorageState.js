import { useEffect, useState } from "react";

export function useLocalStorageState (initialValue, key) {
    const [value, setValue] = useState(() => {
        // this is pure function if you pass a argument it won't work
        // this function will be called only once in the initial render
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}