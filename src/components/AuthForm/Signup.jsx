import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertIcon,
    Button,
    Input,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";

const Signup = () => {
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const { loading, error, signup } = useSignUpWithEmailAndPassword();

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
                placeholder="Username"
                type="text"
                fontSize={14}
                value={inputs.username}
                onChange={(e) =>
                    setInputs({ ...inputs, username: e.target.value })
                }
            />
            <Input
                placeholder="Full Name"
                type="text"
                fontSize={14}
                value={inputs.fullName}
                onChange={(e) =>
                    setInputs({ ...inputs, fullName: e.target.value })
                }
            />

            <InputGroup>
                <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    fontSize={14}
                    value={inputs.password}
                    onChange={(e) =>
                        setInputs({ ...inputs, password: e.target.value })
                    }
                />
                <InputRightElement>
                    <Button
                        variant={"ghost"}
                        size={"sm"}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                </InputRightElement>
            </InputGroup>

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
                isLoading={loading}
                onClick={() => signup(inputs)}
            >
                Sign up
            </Button>
        </>
    );
};

export default Signup;
