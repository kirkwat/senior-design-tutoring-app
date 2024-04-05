import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  editTutorProfile,
  getTutorAndSubjects,
  uploadTutorPicture,
} from "src/api/tutor-api";
import { Button, buttonVariants } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import useAuth from "src/hooks/useAuth";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { Textarea } from "src/components/ui/textarea";
import { Separator } from "src/components/ui/separator";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const editProfileFormSchema = z.object({
  name: z.string().min(2, "Name is required.").max(50),
  bio: z.string().min(2, "Bio is required.").max(500),
  subject1: z.string(),
  subject2: z.string(),
  subject3: z.string(),
  subject4: z.string(),
});

export default function EditTutorProfilePage() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const form = useForm<z.infer<typeof editProfileFormSchema>>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      subject1: "",
      subject2: "",
      subject3: "",
      subject4: "",
    },
  });

  useEffect(() => {
    if (!auth?.id) return;
    setIsLoading(true);

    getTutorAndSubjects(axiosPrivate, auth.id)
      .then((data) => {
        form.reset({
          name: data.name,
          bio: data.bio || "",
          subject1: data.subjects[0] || "",
          subject2: data.subjects[1] || "",
          subject3: data.subjects[2] || "",
          subject4: data.subjects[3] || "",
        });
        setProfilePicture(data.profile_picture);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [auth?.id]);

  function onSubmit(values: z.infer<typeof editProfileFormSchema>) {
    if (!auth || !auth.id) {
      return;
    }

    setIsSubmitting(false);

    const { subject1, subject2, subject3, subject4 } = values;

    const subjects = [subject1, subject2, subject3, subject4]
      .map((subject) => subject.toLowerCase())
      .filter((subject) => subject);

    toast.promise(
      editTutorProfile(
        axiosPrivate,
        auth.id,
        values.bio,
        values.name,
        subjects,
      ),
      {
        loading: "Updating profile...",
        success: () => {
          setIsSubmitting(false);
          navigate("/tutor");
          return "Profile updated successfully!";
        },
        error: (err) => {
          setIsSubmitting(false);
          return (
            err.response?.data?.message ||
            "An error occurred. Please try again."
          );
        },
      },
    );
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length === 1) {
      const file = event.target.files[0];
      if (file && auth?.id) {
        uploadTutorPicture(axiosPrivate, auth.id, file)
          .then((data: any) => {
            if (data.filePath) setProfilePicture(data.filePath);
          })
          .catch((error) => {
            toast.error("Failed to upload picture. Please try again.");
          });
      }
    }
  }

  return (
    <div className="container min-h-[60vh] py-12">
      <div className="flex justify-between items-center flex-col gap-2 md:flex-row mb-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Update your Tutor Profile
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-x-8 gap-y-4"
        >
          <div className="grid gap-x-8 gap-y-4 grid-cols-2">
            <div className="flex flex-col gap-y-4">
              <div>
                <div className="font-medium text-lg">Personal Info</div>
                <div className="text-sm text-muted-foreground">
                  Update your personal information.
                </div>
              </div>
              <div>
                <div className="relative w-fit self-center mx-auto">
                  <div className="group border bg-muted w-36 h-36 rounded-full overflow-hidden">
                    <img
                      src={
                        `${process.env.REACT_APP_API_URL}${profilePicture}` ||
                        "/default_avatar.jpg"
                      }
                      alt="Profile Pic"
                      className="w-full h-full object-cover group-hover:opacity-50"
                    />
                    <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100">
                      <label
                        htmlFor="file-upload"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Upload
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm font-medium mt-2">
                  Profile Picture
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I am studying math in college."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tell us a little bit about yourself.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="my-4 md:hidden" />
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 grid-cols-1">
            <div className="col-span-1 md:col-span-2">
              <div className="font-medium text-lg">Subjects</div>
              <div className="text-sm text-muted-foreground">
                Add the subjects you are comfortable tutoring. Not all fields
                are required.
              </div>
            </div>
            <FormField
              control={form.control}
              name="subject1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Chemistry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject 3</FormLabel>
                  <FormControl>
                    <Input placeholder="Reading" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject4"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject 4</FormLabel>
                  <FormControl>
                    <Input placeholder="Writing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Link
              to="/tutor"
              className={buttonVariants({
                variant: "outline",
                className: "w-full md:w-auto",
              })}
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
