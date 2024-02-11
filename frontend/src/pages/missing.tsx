import { Link } from "react-router-dom";

const Missing = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] py-12 space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Page Not Found
        </h1>
        <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
          The page you are looking for does not exist.
        </p>
      </div>
      <div className="flex flex-col min-[300px]:flex-row gap-2">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
          to="/"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default Missing;
