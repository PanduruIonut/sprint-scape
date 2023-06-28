import { api } from "@/utils/api";
import { useOrganization } from "@clerk/nextjs";
import Masonry from "../templates/masonry";

export default function Venues({ facilityId }: { facilityId: string }) {

    const { organization } = useOrganization();

    if (!organization) return null
    const venues = api.venue.getAllByFacilityId.useQuery({ facilityId: facilityId, pictures: true });
    return (
        <>
            <Masonry items={venues.data ? venues.data : []} promotedVenues={venues.data ? venues.data : []} />
        </>
    )
}