/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useOrganization } from "@clerk/nextjs";
import { Field, type FieldInputProps, Formik, Form } from "formik";
// import { facilitiesRouter } from "@/server/api/routers/facilities";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";

export default function CreateFacility() {
    type FaciltyPayload = {
        name: string;
        description: string;
        address: string;
        city: string;
        phone: string;
        email: string;
        latitude: string;
        longitude: string;
        organisationId: string;
        image: string;
    };

    const { organization } = useOrganization();
    const { mutate, isLoading: isPosting, data } = api.facility.create.useMutation({
        onSuccess: () => {
            console.log("Success")
            toast.success(`Facility created! ${data ? data.name : ''}`); 
        },
        onError: (e: any) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to post! Please try again later.");
            }
        },
    });

    const onSubmit = (payload: FaciltyPayload) => {
        if (!organization) return console.log("No organization")
        mutate({ content: payload });
    };

    return (
        <div>
            <Accordion allowToggle>
                <AccordionItem>
                    <AccordionButton>
                        Create Facility
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <Formik
                            initialValues={{
                                name: '',
                                description: '',
                                address: '',
                                city: '',
                                phone: '',
                                email: '',
                                latitude: '',
                                longitude: '',
                                organisationId: organization?.id || '',
                                image: '',

                            }}
                            onSubmit={(values: FaciltyPayload, { resetForm }) => {
                                void onSubmit(values)
                                resetForm()
                            }}>
                            <Form style={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>
                                <Field name="name" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: any }) => (
                                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                                            <Input {...field} placeholder='name' />
                                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="description" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: any }) => (
                                        <FormControl isInvalid={form.errors.description && form.touched.description}>
                                            <Input {...field} placeholder='description' />
                                            <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="address" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: any }) => (
                                        <FormControl isInvalid={form.errors.address && form.touched.address}>
                                            <Input {...field} placeholder='address' />
                                            <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="city" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: any }) => (
                                        <FormControl isInvalid={form.errors.city && form.touched.city}>
                                            <Input {...field} placeholder='city' />
                                            <FormErrorMessage>{form.errors.city}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="phone" type="number">
                                    {({ field, form }: { field: FieldInputProps<string>, form: any }) => (
                                        <FormControl isInvalid={form.errors.phone && form.touched.phone}>
                                            <Input {...field} placeholder='phone' />
                                            <FormErrorMessage>{form.errors.phone}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="email" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: any }) => (
                                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                                            <Input {...field} placeholder='email' />
                                            <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="latitude" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: any }) => (
                                        <FormControl isInvalid={form.errors.latitude && form.touched.latitude}>
                                            <Input {...field} placeholder='latitude' />
                                            <FormErrorMessage>{form.errors.latitude}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="longitude" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: any }) => (
                                        <FormControl isInvalid={form.errors.longitude && form.touched.longitude}>
                                            <Input {...field} placeholder='longitude' />
                                            <FormErrorMessage>{form.errors.longitude}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <div style={{ textAlign: 'center', padding: '10px' }}>
                                    <Button type="submit">
                                        Create
                                    </Button>
                                </div>
                            </Form>
                        </Formik>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </div>
    )
}