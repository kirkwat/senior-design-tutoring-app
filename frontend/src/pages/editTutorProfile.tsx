import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTutorByID } from "src/api/tutorAPI";
import { ProfilePic } from "src/components/ui/profilePicture";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";

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


const EditTutorProfile = () => {
    const {tutorID} = useParams()
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [newBio, setNewBio] = useState<string | null>(null);
    const [newName, setNewName] = useState<string | null>(null);
    const [newEmail, setNewEmail] = useState<string | null>(null);
    const [newProfilePicture, setNewProfilePicture] = useState<string | null>(null);


    useEffect(() => {
        if (tutorID) {
           getTutorByID(tutorID).then((data) => setTutor(data)).catch((error) => console.error("Error fetching tutor data:", error));
        }
      }, []);
    
    const handleSubmit = () => {

    }

    return (
        <>
        {tutor && (
            <div className="">
                <div className="flex mt-10 ml-40 mb-10">
                    <ProfilePic imageUrl={require('../static/default.jpg')} size={256} />
                    <div className="ml-10 mt-5">
                        <Input type="name" placeholder="Name" />
                        <h2 className="mt-2 text-2xl">Tutor</h2>
                    </div>
                </div>

                <div className="flex justify-center mt-5">
                    <div className="flex-1 ml-40">
                        <div className="text-center">
                            <h1>Knowledge Areas</h1>
                            <Textarea placeholder="Enter list of knowledge areas" />
                        </div>
                    </div>
                    <div className="flex-1 ml-40">
                        <div className="">
                            <h1>Contact Info</h1>
                            <ul className="list-disc list-inside">
                                <Input type="email" placeholder="Email" />
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button className="mt-5" type="submit" onClick={handleSubmit}>Save Changes</Button>
                </div>
            </div>
        )}
    </>
      );









}




export default EditTutorProfile;

