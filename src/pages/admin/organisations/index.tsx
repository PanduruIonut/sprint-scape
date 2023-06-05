import { Card, CardBody, CardHeader, Center, ListItem, UnorderedList } from "@chakra-ui/react";
import { useOrganizationList } from "@clerk/nextjs";
import Link from "next/link";

const OrganizationList = () => {
    const { organizationList, isLoaded } = useOrganizationList();
    if (!isLoaded) {
        return null;
    }

    return (
        <Center height='100vh' width='100vw'>
            <Card boxShadow='lg' variant='outline' align='center' minWidth='md'>
                <CardHeader>Your organizations:</CardHeader>
                <CardBody>
                    {organizationList.length === 0 ? (
                        <div>You do not belong to any organizations yet.</div>
                    ) : (
                        <UnorderedList>
                            {organizationList.map(({ organization }) => (
                                <ListItem key={organization.id}>
                                    <Link
                                        href={`/admin/organisations/${organization.id}`}
                                    >
                                        {organization.name}
                                    </Link>
                                </ListItem>
                            ))}
                        </UnorderedList>
                    )}
                </CardBody>
            </Card>
        </Center>
    );
};

export default OrganizationList;