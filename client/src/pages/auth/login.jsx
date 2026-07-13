import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  const handleDemoAutofill = (role) => {
    const demoData = role === "admin" 
      ? { email: "admin@admin.com", password: "admin1234" }
      : { email: "newuser123@example.com", password: "password123" };

    setFormData(demoData);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-primary">
          Welcome Back
        </h1>
        <p className="text-muted-foreground font-light">
          Please enter your details to sign in
        </p>
      </div>

      <div className="bg-card p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border">
        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />

        {import.meta.env.DEV && (
          <div className="mt-6 space-y-4">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-muted-foreground font-semibold">Demo Accounts</span>
              <div className="flex-grow border-t border-border"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleDemoAutofill("admin")}
                type="button"
                className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs tracking-wider rounded-lg uppercase transition-all shadow-sm hover:shadow"
              >
                Demo Admin
              </button>
              <button
                onClick={() => handleDemoAutofill("user")}
                type="button"
                className="py-2.5 px-4 bg-[#d9a014] hover:bg-[#c49012] text-white font-bold text-xs tracking-wider rounded-lg uppercase transition-all shadow-sm hover:shadow"
              >
                Demo User
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            New to our platform?
            <Link
              className="font-semibold ml-2 text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              to="/auth/register"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default AuthLogin;

