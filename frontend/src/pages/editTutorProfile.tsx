import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTutorByID } from "src/api/tutorAPI";
import { ProfilePic } from "src/components/ui/profilePicture";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Label } from "src/components/ui/label";
import { updateTutorProfile } from "src/api/tutorAPI";

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


const EditTutorProfile = () => {
    const {tutorID} = useParams()
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [newBio, setNewBio] = useState<string>("");
    const [newSubjects, setNewSubjects] = useState<string[]>([]);
    // const [newEmail, setNewEmail] = useState<string>((""));
    const [newProfilePicture, setNewProfilePicture] = useState<number>(0);
    const [newSubject1, setNewSubject1] = useState<string>("");
    const [newSubject2, setNewSubject2] = useState<string>("");
    const [newSubject3, setNewSubject3] = useState<string>("");
    const navigate = useNavigate();


    useEffect(() => {
        if (tutorID) {
           getTutorByID(tutorID).then((data) => setTutor(data)).catch((error) => console.error("Error fetching tutor data:", error));
        }
      }, [tutorID]);

      useEffect(() => {
        if (tutor) {
           setNewSubjects(["Algebra", "Calculus", "Trig"])
           setNewSubject1(newSubjects.length >= 1 ? newSubjects[0] : "")
           setNewSubject2(newSubjects.length >= 2 ? newSubjects[1] : "")
           setNewSubject3(newSubjects.length >= 3 ? newSubjects[2] : "")

        //    setNewEmail(tutor.email)
           setNewBio(tutor.bio)
           setNewProfilePicture(tutor.profile_picture)
        }
      }, [tutor]);
    
    const handleSubmit = () => {
        if (tutor) {
            handleNewSubjects()
            updateTutorProfile(tutor.id, newProfilePicture, newBio, newSubjects)
            navigate(`/tutorProfile/${tutor.id}`);
        }
    }

    const handleNewSubjects = () => {
        setNewSubjects([newSubject1, newSubject2, newSubject3])
    };

    const handleNewSubject1= (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewSubject1(event.target.value);
    };

    const handleNewSubject2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewSubject2(event.target.value);
    };

    const handleNewSubject3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewSubject3(event.target.value);
    };

    // const handleNewEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setNewEmail(event.target.value);
    // };

    const handleNewBio = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewBio(event.target.value);
    };


    return (
        <>
        {tutor && (
            <div className="">
                <div className="flex mt-10 ml-40 mb-10">
                    <ProfilePic imageUrl={require('../static/default.jpg')} size={256} />
                    <div className="ml-10 mt-5">
                        <h1 className="font-bold text-5xl">{tutor.name}</h1>
                        <h2 className="mt-2 text-2xl">Tutor</h2>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea placeholder={newBio} onChange={handleNewBio} style={{ width: '500px', height: '100px' }}/>
                    </div>
                </div>

                <div className="flex justify-center mt-5">
                    <div className="flex-1 ml-40">
                        <div className="text-center">
                            <h1 className="mb-2">Knowledge Areas</h1>
                            <Input className="mb-5" type="subject1" placeholder={newSubject1} onChange={handleNewSubject1} />
                            <Input className="mb-5" type="subject2" placeholder={newSubject2} onChange={handleNewSubject2} />
                            <Input className="mb-5" type="subject3" placeholder={newSubject3} onChange={handleNewSubject3} />
                        </div>
                    </div>
                    <div className="flex-1 ml-40">
                        <div className="">
                            <h1>Contact Info</h1>
                            <ul className="list-disc list-inside">
                                {/* <Input type="email" placeholder={newEmail} onChange={handleNewEmail} /> */}
                                <li className="mb-2">Email: {tutor.email}</li>
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

