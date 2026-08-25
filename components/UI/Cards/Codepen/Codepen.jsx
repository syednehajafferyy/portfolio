import React, { useEffect }  from 'react';
import { useScript } from "@uidotdev/usehooks";

export default function Codepen({url, user}) {
    const parts = url.split("/").filter(Boolean);
    const hash = parts[parts.length - 1];
    const username = user || (parts.length >= 3 ? parts[parts.length - 3] : "codepen");
    const CodePenScript = useScript(
        "https://static.codepen.io/assets/embed/ei.js"
    );

    useEffect(() => {
        if (CodePenScript === "ready" && typeof window !== `undefined`) {
            window.__CPEmbed()
        }
    }, [CodePenScript]);
    return <p className="codepen"
              data-height="400"
              data-default-tab="result"
              data-user={username}
              data-slug-hash={hash}>

    </p>
}