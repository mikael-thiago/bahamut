import * as Yup from "yup";

import {
  Button,
  CircularProgress,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FC, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { LoginRequest } from "@services/AuthService";
import { useFormik } from "formik";
import { useUnloggedAuthContext } from "../../contexts/AuthContext";

const useLoginForm = () => {
  const { login } = useUnloggedAuthContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const onLogin = (request: LoginRequest) => {
    setIsLoading(true);
    setErrors(null);

    login(request)
      .then(() => navigate("/dashboard"))
      .catch(err => setErrors(err.message))
      .finally(() => setIsLoading(false));
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Por favor, informe um email válido")
      .required("O email é obrigatório"),
    password: Yup.string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .required("A senha é obrigatória"),
  });

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: onLogin,
  });

  return {
    isLoading,
    errors,
    loginForm,
    isPasswordVisible,
    togglePasswordVisible: () => setPasswordVisible(isPasswordVisible => !isPasswordVisible),
  };
};

export const Login: FC = () => {
  const { isLoading, errors, loginForm, isPasswordVisible, togglePasswordVisible } = useLoginForm();

  const isFormDisabled = isLoading;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-120 lg:w-144 card flex flex-col">
        <h2 className="text-4xl font-bold mb-12 text-center">Bem vindo!</h2>

        <form onSubmit={loginForm.handleSubmit} className="flex flex-col gap-6">
          <FormControl isInvalid={!!loginForm.errors.email && loginForm.touched.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<EmailIcon />} />
              <Input
                name="email"
                type="email"
                disabled={isFormDisabled}
                onChange={loginForm.handleChange}
                value={loginForm.values.email}
              />
            </InputGroup>
            <FormErrorMessage>{loginForm.errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!loginForm.errors.password && loginForm.touched.password}>
            <FormLabel htmlFor="password">Senha</FormLabel>

            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<LockIcon />} />

              <Input
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                disabled={isFormDisabled}
                onChange={loginForm.handleChange}
                value={loginForm.values.password}
              />

              <InputRightElement
                className="cursor-pointer"
                onClick={togglePasswordVisible}
                children={isPasswordVisible ? <ViewOffIcon /> : <ViewIcon />}
              />
            </InputGroup>
            <FormErrorMessage>{loginForm.errors.password}</FormErrorMessage>
          </FormControl>

          {!!errors && (
            <FormControl isInvalid>
              <FormErrorMessage className="!mt-0">{errors}</FormErrorMessage>
            </FormControl>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isFormDisabled}>
            {!isLoading && "LOGIN"}
            {isLoading && <CircularProgress isIndeterminate size={35} />}
          </Button>

          <Link as={RouterLink} to="/sign-up">
            Ainda não tem uma conta? Registre-se
          </Link>
        </form>
      </div>
    </div>
  );
};
