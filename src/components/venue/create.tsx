import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, FormControl, FormErrorMessage, Input, Select } from "@chakra-ui/react";
import { useOrganization } from "@clerk/nextjs";
import { Field, type FieldInputProps, Formik, Form, ErrorMessage, type FormikProps } from "formik";
import { toast } from "react-hot-toast";
import { api } from "@/utils/api";
import { type Venue } from "@prisma/client";
import { ActivityType, VenueType } from "@prisma/client";
import { useState } from "react";
import MyDropzone from "../myDropzone";

export default function CreateVenue({ facilityId }: { facilityId: string }) {
    const activityOptions = Object.values(ActivityType).map((type) => ({
        value: type,
        label: type,
    }));
    const venueTypeOptions = Object.values(VenueType).map((type) => ({
        value: type,
        label: type,
    }));
    const [selectedActivity, setSelectedActivity] = useState<ActivityType>("" as ActivityType);
    const [selectedVenueType, setSelectedVenueType] = useState<VenueType>("" as VenueType);
    const [files, setFiles] = useState<File[]>([]);
    const { organization } = useOrganization();
    const createPresignedUrl = api.aws.createPresignedUrl.useMutation();
    const { mutate, data } = api.venue.create.useMutation({
        onSuccess: () => {
            console.log("Success")

            toast.success(`Venue created! ${data ? data.name : ''}`);
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

    const onFilesUploaded = (files: File[]) => {
        setFiles(files);
    };

    const uploadFiles = async () => {
        const uploadPromises = files.map((file) => {
            return createPresignedUrl.mutateAsync({
                fileName: file.name,
                fileType: file.type,
                url: file.name,
                venueId: data ? data.id : '',
            });
        });
        const result = await Promise.all(uploadPromises);
        return result;

    }
    const onSubmit = async (payload: Omit<Venue, 'id' | 'createdAt' | 'updatedAt' | 'facilityId' | 'activities' | 'type'>) => {
        if (!organization) return console.log("No organization")
        const res = await uploadFiles();

        for (const presignedPost of res) {
            if (!presignedPost) {
                console.log('no presignedPost');
                continue;
            }

            if (!presignedPost) console.log('no presignedPost')
            const { url, fields } = presignedPost;
            const formData = new FormData();
            Object.entries({ ...fields, file: files[0] }).forEach(([key, value]) => {
                formData.append(key, value as string | Blob);
            });
            await fetch(url, {
                method: "POST",
                body: formData,
            }).catch((error) => {
                console.log('error on uploading', error)
            });
        }
        const venuePictures: string[] = res.map((picture) => {
            if (!picture) return ''
            if (picture.fields && picture.fields.key) return picture.fields.key
            return ''
        });

        mutate({
            content: {
                ...payload,
                facilityId: facilityId,
                activities: selectedActivity ? [selectedActivity] : [],
                type: selectedVenueType,
                pictures: venuePictures ? venuePictures : null,

            }
        });
    };

    return (
        <div>
            <Accordion allowToggle>
                <AccordionItem>
                    <AccordionButton>
                        Create Venue
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <Formik
                            initialValues={{
                                name: "",
                                description: "",
                                address: "",
                            } as Venue}
                            onSubmit={(values, { resetForm }) => {
                                void onSubmit({
                                    name: values.name,
                                    description: values.description,
                                    address: values.address,
                                    maxPlayersCapacity: values.maxPlayersCapacity,
                                })
                                resetForm()
                                setSelectedActivity("" as ActivityType)
                                setSelectedVenueType("" as VenueType)
                            }}>
                            <Form style={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>
                                <Field name="name" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Venue> }) => (
                                        <FormControl isInvalid={!!form.errors.name && !!form.touched.name}>
                                            <Input {...field} placeholder='name' />
                                            <ErrorMessage name="name" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="description" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Venue> }) => (
                                        <FormControl isInvalid={!!form.errors.description && !!form.touched.description}>
                                            <Input {...field} placeholder='description' />
                                            <ErrorMessage name="description" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="address" type="text">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Venue> }) => (
                                        <FormControl isInvalid={!!form.errors.address && !!form.touched.address}>
                                            <Input {...field} placeholder='address' />
                                            <ErrorMessage name="address" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="maxPlayersCapacity" type="number">
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Venue> }) => (
                                        <FormControl isInvalid={!!form.errors.maxPlayersCapacity && !!form.touched.maxPlayersCapacity}>
                                            <Input {...field} placeholder='Max players capacity' type="number" />
                                            <ErrorMessage name="maxPlayersCapacity" render={(message) => (
                                                <FormErrorMessage>{message}</FormErrorMessage>
                                            )} />
                                        </FormControl>
                                    )}
                                </Field>
                                <Select value={selectedVenueType} onChange={(event) => setSelectedVenueType(event.target.value as VenueType)} placeholder="Select a venue">
                                    {venueTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                                <Select value={selectedActivity} onChange={(event) => setSelectedActivity(event.target.value as ActivityType)} placeholder="Select an activity">
                                    {activityOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </Select>
                                <MyDropzone onFilesUploaded={(files) => onFilesUploaded(files)} />
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