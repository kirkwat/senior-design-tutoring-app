import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTutorByID, getTutorSubjects } from "src/api/tutor-api";
import { ProfilePic } from "src/components/ui/profilePicture";
import { Button } from "src/components/ui/button";

interface Tutor {
  id: number;
  user_id: number;
  bio: string;
  name: string;
  email: string;
  password: string;
  profile_picture: number;
  refreshToken: null;
  role: string;
  subjects: string[];
}

const TutorProfile = () => {
  const { tutorID } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [subjects, setSubjects] = useState<Tutor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (tutorID) {
      getTutorByID(tutorID as unknown as number)
        .then((data) => setTutor(data))
        .catch((error) => console.error("Error fetching tutor data:", error));
      getTutorSubjects(tutorID as unknown as number)
        .then((data) => setSubjects(data))
        .catch((error) => console.error("Error fetching tutor data:", error));
    }
  }, [tutorID]);

  const handleEditProfile = () => {
    navigate(`/editTutorProfile/${tutorID}`);
  };

  return (
    <>
      <div className="relative">
        {/* TODO: Change to where it only appears if you are logged in as that user */}
        <Button
          className="absolute top-0 right-0 mr-5"
          onClick={handleEditProfile}
        >
          Edit Profile
        </Button>

        {tutor && (
          <div className="">
            <div className="flex mt-10 ml-40 mb-10">
              <ProfilePic imageUrl={"/default_avatar.jpg"} size={256} />
              <div className="ml-10 mt-5">
                <h1 className="font-bold text-5xl">{tutor.name}</h1>
                <h2 className="mt-2 text-2xl">Tutor</h2>
                <p style={{ maxWidth: "600px" }}>{tutor.bio}</p>
              </div>
            </div>

            <div className="flex justify-center mt-5">
              <div className="flex-1 ml-40">
                <div className="text-center">
                  <h1>Knowledge Areas</h1>
                  <ul className="list-disc list-inside">
                    {subjects &&
                      subjects.map((subject, index) => (
                        <li key={index} className="mb-2">
                          {subject.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <div className="flex-1 ml-40">
                <div className="">
                  <h1>Contact Info</h1>
                  <ul className="list-disc list-inside">
                    <li className="mb-2">Email: {tutor.email}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button className="mt-5" type="submit">
                View Availabilities
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TutorProfile;
