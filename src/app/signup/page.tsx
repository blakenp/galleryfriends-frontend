import SignUpForm from "../components/signup"
import { UserProvider } from "../contexts/userContext"

export default function SignUpPage() {
    return (
        <div>
            <UserProvider>
                <SignUpForm />
            </UserProvider>
        </div>
    )
}