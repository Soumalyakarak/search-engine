import type {Response} from "express"

export const setCookie = (resolve:Response,name:string,value:string) =>{
    resolve.cookie(name,value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 *1000, //7 days
    })
}