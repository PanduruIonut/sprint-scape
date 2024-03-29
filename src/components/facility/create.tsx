import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { useOrganization } from "@clerk/nextjs";
import { Field, type FieldInputProps, Formik, Form, ErrorMessage, type FormikProps } from "formik";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import { type Facility } from "@prisma/client";

export default function CreateFacility() {
    const { organization } = useOrganization();
    const { mutate, data } = api.facility.create.useMutation({
        onSuccess: () => {
            console.log("Success")
            toast.success(`Facility created! ${data ? data.name : ''}`); 
        },
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to post! Please try again later.");
            }
        },
    });

    const onSubmit = (payload: Omit<Facility, 'id' | 'createdAt' | 'updatedAt' | 'organisationId'>) => {
        if (!organization) return console.log("No organization")

        mutate({
            content: {
                ...payload,
                organisationId: organization.id,
            }
        });
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
                            initialValues={{} as Facility}
                            onSubmit={(values, { resetForm }) => {
                                void onSubmit({
                                    name: values.name,
                                    description: values.description,
                                    address: values.address,
                                    phone: values.phone,
                                    email: values.email,
                                    latitude: values.latitude,
                                    longitude: values.longitude,
                                })
                                resetForm()
                            }}>
                            <Form style={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>
                                <Field name="name" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Facility> }) => (
                                        <FormControl isInvalid={!!form.errors.name && !!form.touched.name}>
                                            <Input {...field} placeholder='name' />
                                            <ErrorMessage name="name" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="description" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Facility> }) => (
                                        <FormControl isInvalid={!!form.errors.description && !!form.touched.description}>
                                            <Input {...field} placeholder='description' />
                                            <ErrorMessage name="description" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="address" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Facility> }) => (
                                        <FormControl isInvalid={!!form.errors.address && !!form.touched.address}>
                                            <Input {...field} placeholder='address' />
                                            <ErrorMessage name="address" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="phone" type="number">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Facility> }) => (
                                        <FormControl isInvalid={!!form.errors.phone && !!form.touched.phone}>
                                            <Input {...field} placeholder='phone' />
                                            <ErrorMessage name="phone" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="email" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Facility> }) => (
                                        <FormControl isInvalid={!!form.errors.email && !!form.touched.email}>
                                            <Input {...field} placeholder='email' />
                                            <ErrorMessage name="email" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="latitude" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Facility> }) => (
                                        <FormControl isInvalid={!!form.errors.latitude && !!form.touched.latitude}>
                                            <Input {...field} placeholder='latitude' />
                                            <ErrorMessage name="latitude" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="longitude" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Facility> }) => (
                                        <FormControl isInvalid={!!form.errors.longitude && !!form.touched.longitude}>
                                            <Input {...field} placeholder='longitude' />
                                            <ErrorMessage name="longitude" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
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