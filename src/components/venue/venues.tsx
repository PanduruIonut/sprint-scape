import { api } from "@/utils/api";
import { useOrganization } from "@clerk/nextjs";
import CreateVenue from "./create";
import { Link, ListItem, UnorderedList } from "@chakra-ui/react";

export default function Venues({ facilityId }: { facilityId: string }) {

    const { organization, membership } = useOrganization();
    const { data } = api.facility.getOne.useQuery({ facilityId: facilityId });
    const isAdmin = membership?.role === "admin";

    if (!organization) return null
    const venues = api.venue.getAllByFacilityId.useQuery({ facilityId: facilityId });
    console.log(venues.data)
    return (
        <div>
            <h1>Venues for {data?.name} </h1>
            <UnorderedList>
                {venues.data?.map((venue) => (
                    <ListItem key={organization.id}>
                        <Link
                            href={
                                isAdmin ? `/admin/organisations/${data ? data.organisationId : ''}/facilities/${facilityId}/venues/${venue.id}`
                                    : `/facilities/${facilityId}/venues/${venue.id}`
                            }
                        >
                            {venue.name}
                        </Link>
                    </ListItem>
                ))}
            </UnorderedList>
            {membership?.role === "admin" ? (
            <CreateVenue facilityId={facilityId} />
            ) : null}

        </div>
    )
}