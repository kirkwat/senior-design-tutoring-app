const Tutor = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] py-12 space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Tutors Page
        </h1>
        <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
          Only tutors can access this page.
        </p>
      </div>
    </div>
  );
};

export default Tutor;
