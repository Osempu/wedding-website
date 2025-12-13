import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { CircleUser, Mail, Phone } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { RSVPData } from "../types/database";

function RSVPPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  const formSchema = z.object({
    "text-input-0": z.string().min(2, "Nombre completo es requerido"),
    "email-input-0": z
      .string()
      .email("Email válido es requerido")
      .optional()
      .or(z.literal("")),
    "tel-input-0": z.string().min(10, "Teléfono válido es requerido"),
    "radio-0": z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "text-input-0": "",
      "email-input-0": "",
      "tel-input-0": "",
      "radio-0": "true",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Convert radio string value to boolean
      const rsvpData: RSVPData = {
        full_name: values["text-input-0"],
        email: values["email-input-0"] || undefined,
        phone_number: values["tel-input-0"],
        attendance: values["radio-0"] === "true",
      };

      // Insert data into Supabase
      const { data, error } = await supabase
        .from("rsvp_responses") // Updated table name
        .insert([rsvpData])
        .select();

      if (error) {
        // Handle unique constraint violation for phone number
        if (error.code === "23505" && error.message.includes("phone_number")) {
          throw new Error(
            "Ya existe una respuesta con este número de teléfono. Por favor usa un número diferente."
          );
        }
        throw error;
      }

      console.log("RSVP submitted successfully:", data);
      setSubmitMessage("¡Gracias! Tu respuesta ha sido guardada exitosamente.");
      form.reset();
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      if (error instanceof Error) {
        setSubmitMessage(error.message);
      } else {
        setSubmitMessage(
          "Hubo un error al guardar tu respuesta. Por favor intenta de nuevo."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
    setSubmitMessage("");
  }

  return (
    <>
      <div className="flex align-center justify-center p-5 mb-5">
        <h1 className="text-3xl">Esperamos Verte</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-4/5 xl:w-3/4 2xl:w-2/3 m-auto px-4 lg:px-0 mb-10">
        {/* Photo section - hidden on small screens */}
        <div className="hidden lg:block lg:w-1/2 bg-gray-200 rounded-3xl min-h-[500px] overflow-hidden">
          <img
            src="https://via.placeholder.com/600x800"
            alt="Wedding"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form section */}
        <div className="flex flex-col rounded-3xl w-full lg:w-1/2 justify-center align-center px-6 py-12">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onReset={onReset}
              className="h-full flex flex-col justify-evenly @container"
            >
              <div className="grid grid-cols-12 gap-6 flex-grow">
                <FormField
                  control={form.control}
                  name="text-input-0"
                  render={({ field }) => (
                    <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                      <FormLabel className="flex shrink-0">
                        Nombre Completo
                      </FormLabel>

                      <div className="w-full">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              key="text-input-0"
                              placeholder="Tu nombre completo"
                              type="text"
                              id="text-input-0"
                              className="ps-9"
                              {...field}
                            />
                            <div
                              className={
                                "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                              }
                            >
                              <CircleUser className="size-4" strokeWidth={2} />
                            </div>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email-input-0"
                  render={({ field }) => (
                    <FormItem className="col-span-12 md:col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                      <FormLabel className="flex shrink-0">
                        Email (opcional)
                      </FormLabel>

                      <div className="w-full">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              key="email-input-0"
                              placeholder="tu@email.com"
                              type="email"
                              id="email-input-0"
                              className="ps-9"
                              {...field}
                            />
                            <div
                              className={
                                "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                              }
                            >
                              <Mail className="size-4" strokeWidth={2} />
                            </div>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tel-input-0"
                  render={({ field }) => (
                    <FormItem className="col-span-12 md:col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                      <FormLabel className="flex shrink-0">Teléfono</FormLabel>

                      <div className="w-full">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              key="tel-input-0"
                              placeholder="123-456-7890"
                              type="tel"
                              id="tel-input-0"
                              className="ps-9"
                              {...field}
                            />
                            <div
                              className={
                                "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3"
                              }
                            >
                              <Phone className="size-4" strokeWidth={2} />
                            </div>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="radio-0"
                  render={({ field }) => (
                    <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                      <FormLabel className="flex shrink-0">
                        ¿Asistirás?
                      </FormLabel>

                      <div className="w-full">
                        <FormControl>
                          <RadioGroup
                            key="radio-0"
                            id="radio-0"
                            className="w-full flex gap-6"
                            {...field}
                            onValueChange={field.onChange}
                          >
                            <FormLabel
                              key="true"
                              className="border-0 p-0 flex items-center gap-2 cursor-pointer has-[[data-state=checked]]:text-primary"
                              htmlFor="radio-0-true"
                            >
                              <RadioGroupItem value="true" id="radio-0-true" />
                              <span className="font-normal">Sí, asistiré</span>
                            </FormLabel>

                            <FormLabel
                              key="false"
                              className="border-0 p-0 flex items-center gap-2 cursor-pointer has-[[data-state=checked]]:text-primary"
                              htmlFor="radio-0-false"
                            >
                              <RadioGroupItem
                                value="false"
                                id="radio-0-false"
                              />
                              <span className="font-normal">
                                No podré asistir
                              </span>
                            </FormLabel>
                          </RadioGroup>
                        </FormControl>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="col-span-12">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Confirmar Asistencia"}
                  </Button>

                  {submitMessage && (
                    <div
                      className={`mt-4 p-3 rounded-md ${
                        submitMessage.includes("exitosamente")
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {submitMessage}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default RSVPPage;
