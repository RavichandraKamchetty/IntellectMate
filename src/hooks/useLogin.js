import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import useShowToast from "./useShowToast";
import { doc, getDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";

const useLogin = () => {
    const [signInWithEmailAndPassword, , loading, error] =
        useSignInWithEmailAndPassword(auth);

    const loginUser = useAuthStore((state) => state.login);

    const showToast = useShowToast();

    const login = async (inputs) => {
        try {
            if (!inputs.email || !inputs.password) {
                showToast("Error", "Please fill all the fields", "error");
                return;
            }

            const userCred = await signInWithEmailAndPassword(
                inputs.email,
                inputs.password
            );

            if (userCred) {
                const docRef = doc(firestore, "users", userCred.user.uid);
                const docSnap = await getDoc(docRef);

                localStorage.setItem(
                    "user-info",
                    JSON.stringify(docSnap.data())
                );

                loginUser(docSnap.data());
                showToast("Success", "Login Successful", "success");
            }

            if (!userCred) {
                showToast("Error", error.message, "error");
                return;
            }
        } catch (error) {
            console.error("Login error:", error);
            console.error(
                "Firebase Authentication Error:",
                error.code,
                error.message
            );
            showToast("Error", error.message, "error");
            return;
        }
    };

    return { loading, error, login };
};

export default useLogin;
