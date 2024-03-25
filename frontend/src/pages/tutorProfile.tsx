import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTutorByID } from "src/api/tutorAPI";
import { ProfilePic } from "src/components/ui/profilePicture";
import { Button } from "src/components/ui/button";


interface Tutor {
    id: number;
    user_id: number;
    bio: string;
    name: string;
    email: string;
    password: string;
    profile_picture: string;
    refreshToken: null;
    role: string;
  }


const TutorProfile = () => {
    const {tutorID} = useParams()
    const [tutor, setTutor] = useState<Tutor | null>(null);


    useEffect(() => {
        if (tutorID) {
           getTutorByID(tutorID).then((data) => setTutor(data)).catch((error) => console.error("Error fetching tutor data:", error));
        }
      }, []);


    return (
        <>
        {tutor && (
            <div className="">
                <div className="flex mt-10 ml-40 mb-10">
                    <ProfilePic imageUrl={require('../static/default.jpg')} size={256} />
                    <div className="ml-10 mt-5">
                        <h1 className="font-bold text-5xl">John Smith</h1>
                        <h2 className="mt-2 text-2xl">Tutor</h2>
                    </div>
                </div>

                <div className="flex justify-center mt-5">
                    <div className="flex-1 ml-40">
                        <div className="text-center">
                            <h1>Knowledge Areas</h1>
                            <ul className="list-disc list-inside">
                                <li className="mb-2">Algebra</li>
                                <li className="mb-2">Calculus</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex-1 ml-40">
                        <div className="">
                            <h1>Contact Info</h1>
                            <ul className="list-disc list-inside">
                                {/* <li className="mb-2">Email: {tutor.email}</li> */}
                                <li className="mb-2">Email: johnsmith@example.com</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button className="mt-5" type="submit">View Availabilities</Button>
                </div>
            </div>
        )}
    </>
      );
};


export default TutorProfile;



