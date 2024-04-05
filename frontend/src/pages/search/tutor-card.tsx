import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import { Separator } from "src/components/ui/separator";
import { getAvatarUrl } from "src/lib/utils";
import { Tutor } from "src/types/tutor";

export default function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <Card className="p-5 h-full">
      <Avatar className="h-56 w-56 mx-auto">
        <AvatarImage
          src={getAvatarUrl(tutor.profile_picture)}
          alt={tutor.name}
        />
        <AvatarFallback>T</AvatarFallback>
      </Avatar>
      <Separator className="my-4" />
      <div className="flex flex-col justify-between md:min-h-48">
        <h5 className="text-xl font-bold text-center">{tutor.name}</h5>
        {tutor.bio && (
          <div>
            <div className="font-medium text-sm">About</div>
            <p className="text-muted-foreground">{tutor.bio}</p>
          </div>
        )}
        {tutor.subjects.length > 0 && (
          <div className="mt-2">
            <div className="font-medium text-sm">Subjects</div>
            <div className="flex gap-2 mt-1 flex-wrap">
              {tutor.subjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="capitalize">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <Button className="mt-4 w-full self-end">Book Appointment</Button>
      </div>
    </Card>
  );
}
