import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Zap } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-foreground">Home Office AI</span>
          </div>
          <p className="text-muted-foreground">Entre ou crie sua conta</p>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border shadow-lg">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(24 100% 50%)",
                    brandAccent: "hsl(14 100% 45%)",
                    inputBackground: "hsl(0 0% 15%)",
                    inputText: "hsl(0 0% 98%)",
                    inputBorder: "hsl(0 0% 20%)",
                    inputBorderFocus: "hsl(24 100% 50%)",
                    inputBorderHover: "hsl(0 0% 30%)",
                  },
                },
              },
              className: {
                button: "!bg-primary !text-primary-foreground hover:!bg-primary/90",
                input: "!bg-secondary !text-foreground !border-border",
                label: "!text-foreground",
                anchor: "!text-primary hover:!text-primary/80",
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Senha",
                  button_label: "Entrar",
                  link_text: "Já tem uma conta? Entre",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Senha",
                  button_label: "Criar conta",
                  link_text: "Não tem uma conta? Cadastre-se",
                },
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/dashboard`}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
