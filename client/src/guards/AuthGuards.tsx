import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { PropsWithChildren, useEffect, useState } from "react";

import { useAuthContext } from "../contexts/AuthContext";

export const LoggedGuard = () => {
  const { isLoggedIn } = useAuthContext();
  const navigate = useNavigate();
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (!isLoggedIn && firstRender) {
      navigate("/login");
      setFirstRender(false);
    }
  }, [isLoggedIn]);

  return <Outlet />;
};

export const UnloggedGuard = () => {
  const { isLoggedIn } = useAuthContext();
  const [query] = useSearchParams();
  const [firstRender, setFirstRender] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && firstRender) {
      navigate(query.get("returnUrl") ?? "/dashboard");
      setFirstRender(false);
    }
  }, [isLoggedIn]);

  return <Outlet />;
};
