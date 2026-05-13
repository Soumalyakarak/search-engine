import type {Response} from "express"

export const setCookie = (resolve:Response,name:string,value:string) =>{
    resolve.cookie(name,value, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 *1000, //7 days
    })
}