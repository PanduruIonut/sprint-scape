import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Card, Center, Divider, Select } from "@chakra-ui/react";
import MemberList from "@/components/memberList";
import InvitationList from "@/components/invitationList";
import CreateFacility from "@/components/facility/create";
import { useState } from "react";
import Facilities from "@/components/facility/facilities";
import { type OrganizationMembershipResource, type OrganizationResource } from "@clerk/types";

export default function Switcher() {
    const { setActive, organizationList, isLoaded } = useOrganizationList();
    const { organization } = useOrganization();
    const [selectedOrganisation, setSelectedOrganisation] = useState<OrganizationResource>();

    if (!isLoaded) {
        return null;
    }

    if (!organization) {
        return null;
    }

    const handleOrgChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const element = event.target as HTMLSelectElement;
        console.log("Setting active organization", element.value)
        const organisationFromList = organizationList.find((org) => org.organization.id === element.value);
        if (!organisationFromList) return console.log("No organisation from list")
        setSelectedOrganisation(organisationFromList.organization);
        void setActive({ organization: organisationFromList.organization });
    };

    return (
        <Center height='100vh' width='100vw'>
            <Card boxShadow='2xl' variant='outline' align='center' minWidth='md'>
                <Select
                    value={selectedOrganisation?.id}
                    onChange={handleOrgChange}
                >
                    {createOrganizationOptions(organizationList)?.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            defaultChecked={option.value === organization.id}
                        >
                            {option.label}
                        </option>
                    ))}
                </Select>
                <Divider orientation='horizontal' />
                <OrganizationInfo />
                <CreateFacility />
                <Facilities />
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


function createOrganizationOptions(organizationList: {
    membership: OrganizationMembershipResource;
    organization: OrganizationResource;
}[] | undefined) {
    return organizationList?.map(({ organization }) => ({
        value: organization.id,
        label: organization.name,
    }));
}