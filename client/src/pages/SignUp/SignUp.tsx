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
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { SignUpRequest, useAuthService } from "@services/AuthService";

import { useFormik } from "formik";

const useSignUpForm = () => {
  const { signUp } = useAuthService();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const onSignUp = (request: SignUpRequest) => {
    setIsLoading(true);
    setErrors(null);

    signUp(request)
      .then(() => navigate("/login"))
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

  const signUpForm = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },
    validationSchema,
    onSubmit: onSignUp,
  });

  return {
    isLoading,
    errors,
    signUpForm,
    isPasswordVisible,
    togglePasswordVisible: () => setPasswordVisible(isPasswordVisible => !isPasswordVisible),
  };
};

export const SignUp = () => {
  const { isLoading, errors, signUpForm, isPasswordVisible, togglePasswordVisible } =
    useSignUpForm();

  const isFormDisabled = isLoading;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-120 lg:w-144 card flex flex-col">
        <h2 className="text-4xl font-bold mb-3 text-left">Cadastro</h2>
        <h3 className="text-base font-semibold mb-12">Levará apenas alguns segundos</h3>

        <form onSubmit={signUpForm.handleSubmit} className="flex flex-col gap-6">
          <FormControl isInvalid={!!signUpForm.errors.email && signUpForm.touched.email}>
            <FormLabel htmlFor="email">Email*</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<EmailIcon />} />
              <Input
                name="email"
                type="email"
                disabled={isFormDisabled}
                onChange={signUpForm.handleChange}
                value={signUpForm.values.email}
              />
            </InputGroup>
            <FormErrorMessage>{signUpForm.errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!signUpForm.errors.password && signUpForm.touched.password}>
            <FormLabel htmlFor="password">Senha*</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<LockIcon />} />

              <Input
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                disabled={isFormDisabled}
                onChange={signUpForm.handleChange}
                value={signUpForm.values.password}
              />

              <InputRightElement
                className="cursor-pointer"
                onClick={togglePasswordVisible}
                children={isPasswordVisible ? <ViewOffIcon /> : <ViewIcon />}
              />
            </InputGroup>
            <FormErrorMessage>{signUpForm.errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!signUpForm.errors.name && signUpForm.touched.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <InputGroup>
              {/* <InputLeftElement pointerEvents="none" children={<UserIcon />} /> */}

              <Input
                name="name"
                type="text"
                disabled={isFormDisabled}
                onChange={signUpForm.handleChange}
                value={signUpForm.values.name}
              />
            </InputGroup>

            <FormErrorMessage>{signUpForm.errors.name}</FormErrorMessage>
          </FormControl>

          {!!errors && (
            <FormControl isInvalid>
              <FormErrorMessage className="!mt-0">{errors}</FormErrorMessage>
            </FormControl>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isFormDisabled}>
            {!isLoading && "Cadastrar-se"}
            {isLoading && <CircularProgress isIndeterminate size={35} />}
          </Button>

          <Link as={RouterLink} to="/login">
            Já possui uma conta? Faça login!
          </Link>
        </form>
      </div>
    </div>
  );
};
