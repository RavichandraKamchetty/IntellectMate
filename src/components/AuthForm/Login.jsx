import { Alert, AlertIcon, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";

const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const { loading, error, login } = useLogin();

    return (
        <>
            <Input
                placeholder="Email"
                type="email"
                fontSize={14}
                value={inputs.email}
                onChange={(e) =>
                    setInputs({ ...inputs, email: e.target.value })
                }
            />
            <Input
                placeholder="Password"
                type="password"
                fontSize={14}
                value={inputs.password}
                onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                }
            />

            {error && (
                <Alert status="error" fontSize={13} p={2} borderRadius={4}>
                    <AlertIcon fontSize={12} />
                    {error.message}
                </Alert>
            )}

            <Button
                size={"sm"}
                w={"full"}
                colorScheme="blue"
                fontSize={14}
                // onClick={handleAuth}
                isLoading={loading}
                onClick={() => login(inputs)}
            >
                Log in
            </Button>
        </>
    );
};

export default Login;
