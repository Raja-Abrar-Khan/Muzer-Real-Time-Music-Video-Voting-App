"use client";
//recoil ,themeprovider
//learn context api


import { SessionProvider } from "next-auth/react";

export function Providers({children}:{
    children: React.ReactNode
}){
return<SessionProvider>
    {children}
</SessionProvider>
}