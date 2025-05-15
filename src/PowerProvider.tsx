import { initialize } from "@power-platform/power-code-sdk/lib/Lifecycle";
import { useEffect } from "react";

export default function PowerProvider() {
    useEffect(() => {
        const initApp = async () => {
          await initialize();
        }
        initApp().then(async () => {
            console.log('Power Platform SDK initialized successfully');
        })
    }, []);

    return (<></>);
}