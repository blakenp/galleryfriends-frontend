import SignUpForm from "../components/signup"
import { UserProvider } from "../contexts/userContext"

export default function SignUpPage() {
    return (
        <div>
            <UserProvider>
                <h1>Sign up here!</h1>
                <SignUpForm />
            </UserProvider>
        </div>
    )
}