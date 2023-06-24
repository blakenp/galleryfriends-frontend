'use client';

export default function LogOutPage() {
    sessionStorage.removeItem('sessionToken')
    window.location.href = "/"

    return (
        <h1>Logging out...</h1>
    )
}