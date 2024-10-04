import { ReactNode } from "react";

export function Container({children}: { children: ReactNode}){
    return(
        <div className="w-full mx-auto max-w-7xl px-2">
            {children}
        </div>
    )
}