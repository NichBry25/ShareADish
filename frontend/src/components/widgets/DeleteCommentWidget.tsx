'use server'
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { requireAuth } from "@/lib/auth/requireAuth";
import { cookies } from "next/headers";
import api from "@/lib/axios";

type CommentDeleteProp={
    comment_name:string
}

export default async function CommentDeleteButton({comment_name}:CommentDeleteProp){
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    let username;
    try{
        const res = await api.get("/user/me", {
            headers: { Cookie: `access_token=${token}` },
        });
        if(res.status>=200 && res.status <=300){
            const data = res.data
            username = data.username
        }
    }catch (err) {
        console.error(err);
    }

    return(
        <>
        {
            comment_name===username?
            <button>delete</button>
            :
            <></>
        }
        </>
    )

}