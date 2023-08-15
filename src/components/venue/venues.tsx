import { api } from "@/utils/api";
import Masonry from "../templates/masonry";

export default function Venues({ facilityId }: { facilityId: string }) {


    const venues = api.venue.getAllByFacilityId.useQuery({ facilityId: facilityId, pictures: true });
    return (
        <>
            <Masonry items={venues.data ? venues.data : []} promotedVenues={venues.data ? venues.data : []} />
        </>
    )
}