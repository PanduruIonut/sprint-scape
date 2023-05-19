/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/jsx-no-undef */
import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { Field, type FieldInputProps, Form, Formik } from "formik";
import { Button, FormControl, FormErrorMessage, Input, Radio, RadioGroup, Stack } from "@chakra-ui/react";

export default function InvitationList() {
    const { invitationList } = useOrganization({ invitationList: {} });

    if (!invitationList) {
        return null;
    }

    return (
        <div style={{ paddingTop: '20px' }}>
            <h2>Invite member: </h2>
            <InviteMember />
            <div style={{ textAlign: 'center' }}> {invitationList.length === 0 ? (
                <div style={{ fontStyle: 'italic', fontSize: '13px' }}>No pending invitations</div>
            ) : (
                <div>
                    <h2>Pending invitations</h2>
                    <ul>
                        {invitationList.map((i) => (
                            <li key={i.id}>
                                {i.emailAddress} <button>Revoke</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            </div>
        </div>
    );
}

const InviteMember = () => {
    const { organization } = useOrganization();
    const [emailAddress, setEmailAddress] = useState("");
    const [role, setRole] = useState<"basic_member" | "admin">("basic_member");
    const [disabled, setDisabled] = useState(false);

    const onSubmit = async (email: string) => {
        setDisabled(true);
        if (!organization) return console.log("No organization")
        await organization.inviteMember({ emailAddress: email, role });
        setEmailAddress("");
        setRole("basic_member");
        setDisabled(false);
    };

    type InvitePayload = {
        email: string;
    };
    const validateEmail = (value: string) => {
        let error
        if (!value) {
            error = 'Email is required'
        } else if (value && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Email address is invalid'
        }
        return error
    }

    return (
        <Formik
            initialValues={{ email: "" }}
            onSubmit={(values: InvitePayload, _actions) => {
                void onSubmit(values.email)
            }}>
            <Form>
                <Field name='email' validate={validateEmail}>
                    {({ field, form }: { field: FieldInputProps<string>, form: any }) => (
                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                            <Input {...field} placeholder='email' />
                            <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                        </FormControl>
                    )}
                </Field>
                <RadioGroup>
                    <Stack spacing={5} direction='row'>
                        <Radio colorScheme='blue' value='admin' onChange={() => { setRole("admin") }} >
                            Admin
                        </Radio>
                        <Radio colorScheme='blue' value='basic_member' onChange={() => { setRole("basic_member") }}>
                            Member
                        </Radio>
                    </Stack>
                </RadioGroup>
                <div style={{ textAlign: 'center', padding: '10px' }}>
                    <Button type="submit" disabled={disabled}>
                        Invite
                    </Button>
                </div>
            </Form >
        </Formik >
    );
};