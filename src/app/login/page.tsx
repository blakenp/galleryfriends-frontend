import LoginComponent from "../components/login"
import { AuthProvider } from "../contexts/authContext"
import { UserProvider } from "../contexts/userContext"

export default function LoginPage() {
    return (
        <AuthProvider>
            <UserProvider>
                <LoginComponent />
            </UserProvider>
        </AuthProvider>
    )
}