
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const Index = () => {
  const navigate = useNavigate();
  // No authentication logic needed
  // Optionally, redirect to dashboard or module
  useEffect(() => {
    navigate("/");
  }, [navigate]);
  return null;
};

export default Index;
