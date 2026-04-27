import { useEffect } from "react";

export default function HomePage(){

    useEffect(()=>{
    fetch('/api/users')
        .then(r=>r.json())
        .then(data=>console.log(data));
    },[])

    return (
    <h1>HOME PAGE</h1>
    )
}
