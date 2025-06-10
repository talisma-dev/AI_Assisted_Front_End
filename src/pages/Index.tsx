
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const Index = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on login status
    if (state.currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [state.currentUser, navigate]);

  return null; // This component just handles redirection
};

export default Index;
