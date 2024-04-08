import { Link } from "react-router-dom";
import { buttonVariants } from "src/components/ui/button";

const Missing = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] py-12 space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Page Not Found
        </h1>
        <p className="text-muted-foreground md:text-xl/relaxed">
          The page you are looking for does not exist.
        </p>
      </div>
      <div className="flex flex-col min-[300px]:flex-row gap-2">
        <Link className={buttonVariants({ variant: "outline" })} to="/">
          Go back to your dashboard
        </Link>
      </div>
    </div>
  );
};

export default Missing;
