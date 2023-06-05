import { useOrganization } from "@clerk/nextjs";
import { Card, Center, Divider } from "@chakra-ui/react";
import MemberList from "@/components/memberList";
import InvitationList from "@/components/invitationList";
import CreateFacility from "@/components/facility/create";
import Facilities from "@/components/facility/facilities";

export default function Organisation() {

    return (
        <Center height='100vh' width='100vw'>
            <Card boxShadow='2xl' variant='outline' align='center' minWidth='md'>
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