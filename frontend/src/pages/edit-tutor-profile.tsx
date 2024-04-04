import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { editTutorProfile, getTutorAndSubjects } from "src/api/tutor-api";
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
  profile_picture: z.string(),
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

  const form = useForm<z.infer<typeof editProfileFormSchema>>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      profile_picture: "",
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
          profile_picture: data.profile_picture || "",
          subject1: data.subjects[0] || "",
          subject2: data.subjects[1] || "",
          subject3: data.subjects[2] || "",
          subject4: data.subjects[3] || "",
        });
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
        values.profile_picture,
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

  return (
    <div className="container min-h-[60vh] py-12">
      <div className="flex justify-between items-center flex-col gap-2 md:flex-row mb-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Update your Tutor Profile
        </h1>
      </div>
      <Form {...form}>
        <div className="font-medium text-lg">Personal Info</div>
        <div className="text-sm text-muted-foreground">
          Update your personal information.
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
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
              name="profile_picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://imgur.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a link to your profile picture.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="mt-4">
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
          <Separator className="my-4" />
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
              })}
            >
              Cancel
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
