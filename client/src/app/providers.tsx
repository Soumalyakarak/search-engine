'use client'
import React,{useState} from 'react'
import { ThemeProvider } from "next-themes";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"

export default function Providers({children}:{children:React.ReactNode}) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <ThemeProvider
         attribute="class"
         defaultTheme="light"
         enableSystem={false}
         disableTransitionOnChange
        >
           <QueryClientProvider client={queryClient}>
            {children}
           </QueryClientProvider>
        </ThemeProvider>
    )
}
