import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] py-12 space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Unauthorized
        </h1>
        <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
          You do not have access to the requested page.
        </p>
      </div>
      <div className="flex flex-col min-[300px]:flex-row gap-2">
        <button
          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
          onClick={goBack}
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
