import { useEffect, useState } from "react";
import { getAllTutorsWithSubjects } from "src/api/tutor-api";
import useAuth from "src/hooks/useAuth";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import { Tutor } from "src/types/tutor";
import TutorCard from "./tutor-card";
import { Input } from "src/components/ui/input";
import { Search } from "lucide-react";

export default function SearchPage() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);

  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [searchResults, setSearchResults] = useState<Tutor[]>([]);

  useEffect(() => {
    if (!auth?.id) return;
    setIsLoading(true);

    getAllTutorsWithSubjects(axiosPrivate)
      .then((data) => {
        setTutors(data);
        setSearchResults(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <div className="container min-h-[60vh] py-12">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-4xl text-center">
        Find a Tutor
      </h1>
      <p className="text-muted-foreground md:text-lg/relaxed max-w-md text-center mx-auto mt-2 mb-4">
        Here are some tutors that you can book appointments with.
      </p>
      <TutorSearch tutors={tutors} setSearchResults={setSearchResults} />
      {isLoading ? (
        <div className="mt-8 md:mt-24 text-center text-muted-foreground font-medium text-xl">
          Loading tutors...
        </div>
      ) : searchResults.length > 0 ? (
        <div className="max-w-3xl mx-auto mt-8">
          <div className="text-sm font-medium">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}{" "}
            found
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {searchResults.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 md:mt-24 text-center text-muted-foreground font-medium text-xl">
          No tutors found.
        </div>
      )}
    </div>
  );
}

function TutorSearch({
  tutors,
  setSearchResults,
}: {
  tutors: Tutor[];
  setSearchResults: React.Dispatch<React.SetStateAction<Tutor[]>>;
}) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.toLowerCase();

    const results = tutors.filter(
      (tutor) =>
        tutor.name.toLowerCase().includes(searchQuery) ||
        tutor.subjects.some((subject) =>
          subject.toLowerCase().includes(searchQuery),
        ),
    );

    setSearchResults(results);
  };

  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-2.5 top-[10px] h-5 w-5 text-muted-foreground" />
      <Input
        placeholder="Search by name or subject"
        onChange={handleSearch}
        className="pl-10 w-full"
      />
    </div>
  );
}
