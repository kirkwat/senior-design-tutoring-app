import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAppointment } from "src/api/appointment-api";
import { Button } from "src/components/ui/button";
import useAxiosPrivate from "src/hooks/useAxiosPrivate";
import useAuth from "src/hooks/useAuth";
import { Calendar } from "src/components/ui/calendar";
import { Input } from "src/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { toast } from "sonner";

const createAppointmentFormSchema = z.object({
  startTime: z.string().min(1, {
    message: "Please select a valid time.",
  }),
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  appointmentLength: z.string(),
  weekSpan: z.string(),
  zoomLink: z.string(),
});

export default function CreateAppointment() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof createAppointmentFormSchema>>({
    resolver: zodResolver(createAppointmentFormSchema),
    defaultValues: {
      startTime: "12:00",
      weekSpan: "1",
      appointmentLength: "30",
      zoomLink: "",
    },
  });

  function onSubmit(values: z.infer<typeof createAppointmentFormSchema>) {
    if (!auth || !auth.id) {
      return;
    }

    setIsSubmitting(true);

    const [hours, minutes] = values.startTime.split(":").map(Number);
    values.startDate.setHours(hours, minutes, 0, 0);
    const isoDateTime = values.startDate.toISOString();

    toast.promise(
      createAppointment(
        axiosPrivate,
        auth.id,
        isoDateTime,
        parseInt(values.appointmentLength, 10),
        parseInt(values.weekSpan, 10),
        values.zoomLink,
      ),
      {
        loading: "Creating appointments...",
        success: (data: any) => {
          setIsSubmitting(false);
          navigate("/tutor");
          return `${data.created} appointment${data.created !== 1 ? "s have" : " has"} been created. ${data.failed ? `${data.failed} appointment${data.failed !== 1 ? "s" : ""} could not be created due to conflicts.` : ""}`;
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
    <div className="container min-h-[60vh] py-12 space-y-4 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Create an Appointment
        </h1>
      </div>
      <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400 max-w-md">
        Schedule blocks of time where you are available to tutor students.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-8 flex flex-col lg:flex-row items-center lg:items-start"
        >
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Appointment Date</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border w-fit"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is when your appointment will start.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weekSpan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration in Weeks</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["1", "2", "3", "4", "5", "6"].map((week) => (
                        <SelectItem key={week} value={week}>
                          {week} {week === "1" ? "Week" : "Weeks"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select how many weeks this appointment will be available on
                    the same day.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Length</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["30", "45", "60", "90"].map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {`${minute} Minutes`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select how long each appointment will be.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zoomLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zoom Link</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://zoom.com/meeting"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the link to your Zoom meeting. (API integration
                    coming soon)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="col-span-2"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
