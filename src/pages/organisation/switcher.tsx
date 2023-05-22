/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Card, Center, Divider, Select } from "@chakra-ui/react";
import MemberList from "@/components/memberList";
import InvitationList from "@/components/invitationList";
import CreateFacility from "@/components/facility/create";
import { useEffect } from "react";

export default function Switcher() {
    const router = useRouter();
    const { setActive, organizationList, isLoaded } = useOrganizationList();
    const { organization, ...rest } = useOrganization();

    useEffect(() => {
        if (router.query.selected && isLoaded) {
            void setActive({ organization: router.query.selected as string });
        }
    }, [isLoaded, router.query.selected, setActive]);

    if (!isLoaded) {
        return null;
    }

    const handleOrgChange = (e: any) => {
        void setActive({ organization: e.value });
    };

    if (!organization) {
        return null;
    }

    return (
        <Center height='100vh' width='100vw'>
            <Card boxShadow='2xl' variant='outline' align='center' minWidth='md'>
                <Select>
                    {createOrganizationOptions(organizationList).map((option: any) => (
                        <option
                            key={option.value}
                            value={option.value}
                            defaultChecked={option.value === organization.id}
                            onChange={handleOrgChange}
                        >
                            {option.label}
                        </option>
                    ))}
                </Select>
                <Divider orientation='horizontal' />
                <OrganizationInfo />
                <CreateFacility />
            </Card>
        </Center>
    );
}

function OrganizationInfo() {
    const {
        organization: currentOrganization,
        membership,
        isLoaded,
    } = useOrganization();

    if (!isLoaded || !currentOrganization) {
        return null;
    }

    const isAdmin = membership?.role === "admin";
    return (
        <>
            <MemberList />
            {isAdmin && <InvitationList />}
        </>
    );
}


function createOrganizationOptions(organizationList: any): any {
    return organizationList.map(({ organization }: any) => ({
        value: organization.id,
        label: organization.name,
    }));
}