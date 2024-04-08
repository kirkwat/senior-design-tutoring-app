import { useNavigate } from "react-router-dom";
import { Button } from "src/components/ui/button";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] py-12 space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Unauthorized
        </h1>
        <p className="text-muted-foreground md:text-xl/relaxed">
          You do not have access to the requested page.
        </p>
      </div>
      <div className="flex flex-col min-[300px]:flex-row gap-2">
        <Button onClick={goBack} variant="outline">
          Go back
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
