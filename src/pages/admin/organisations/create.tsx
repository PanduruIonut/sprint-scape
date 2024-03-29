import { Button, Card, CardBody, CardHeader, Center, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useOrganizationList } from "@clerk/nextjs";
import { Field, type FieldInputProps, Form, Formik, type FormikProps } from "formik";
import toast from "react-hot-toast";


export default function CreateOrganization() {
    interface Values {
        name: string;
        email: string;
        phoneNumber: string;
    }
    const { createOrganization, setActive, isLoaded } = useOrganizationList();

    const handleSubmit = (organisationName: string) => {
        if (!isLoaded) return
        console.log("organizationName", organisationName)
        const organization = void createOrganization({ name: organisationName })
            .then((organization) => {
                toast.success(`Organization created! ${organization ? organization.name : ''}`);
            })
            .catch((e: Error) => {
                toast.error(`Failed to create organization! ${e.message}`);
            });
        void setActive({ organization });
    };
    const validateName = (value: string) => {
        let error
        if (!value) {
            error = 'Organisation name is required'
        }
        if (value && value.length < 3) {
            error = 'Organisation name must be at least 3 characters'
        }
        if (value && value.length > 25) {
            error = 'Organisation name must be less than 25 characters'
        }
        if (!/^[a-zA-Z0-9_ ]*$/.test(value)) {
            error = 'Organisation name must be alphanumeric'
        }
        return error
    }
    const validateEmail = (value: string) => {
        let error
        if (!value) {
            error = 'Email is required'
        } else if (value && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Email address is invalid'
        }
        return error
    }
    const validatePhoneNumber = (value: string) => {
        let error
        if (!value) {
            error = 'Phone number is required'
        } else if (value && value.length < 10) {
            error = 'Phone number must be 10 digits'
        } else if (value && value.length > 10) {
            error = 'Phone number must be 10 digits'
        } else if (value && !/^[0-9]*$/.test(value)) {
            error = 'Phone number must be numeric'
        }
        return error
    }

    return (

        <Center height='100vh' width='100vw'>
            <Card boxShadow='2xl' variant='outline' align='center' minWidth='md'>
                <CardHeader>Create your organization</CardHeader>
                <CardBody minWidth='md' >
                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            phoneNumber: ''
                        }}
                        onSubmit={(values, { resetForm }) => {
                            handleSubmit(values.name)
                            resetForm()
                        }}
                    >
                        {() => (
                            <Form>
                                <Field name='name' validate={validateName} >
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Values> }) => (
                                        <FormControl isInvalid={!!form.errors.name && !!form.touched.name}>
                                            <FormLabel>Name</FormLabel>
                                            <Input {...field} placeholder='name' />
                                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='email' validate={validateEmail}>
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Values> }) => (
                                        <FormControl isInvalid={!!form.errors.email && !!form.touched.email}>
                                            <FormLabel>Email</FormLabel>
                                            <Input {...field} placeholder='email' />
                                            <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='phoneNumber' validate={validatePhoneNumber}>
                                    {({ field, form }: { field: FieldInputProps<string>, form: FormikProps<Values> }) => (
                                        <FormControl isInvalid={!!form.errors.phoneNumber && !!form.touched.phoneNumber}>
                                            <FormLabel>Phone Number</FormLabel>
                                            <Input {...field} placeholder='phone number' />
                                            <FormErrorMessage>{form.errors.phoneNumber}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Button
                                    mt={4}
                                    colorScheme='blue'
                                    type='submit'
                                >
                                    Submit
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </Center>)
}