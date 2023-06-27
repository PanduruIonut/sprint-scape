import { api } from "@/utils/api";
import { useOrganization } from "@clerk/nextjs";
import Masonry from "../atoms/masonry";
import CreateVenue from "./create";

export default function Venues({ facilityId }: { facilityId: string }) {

    const { organization, membership } = useOrganization();
    const { data } = api.facility.getOne.useQuery({ facilityId: facilityId });

    if (!organization) return null
    const venues = api.venue.getAllByFacilityId.useQuery({ facilityId: facilityId, pictures: true });
    console.log(venues.data)
    return (
        <>
            <h1>Venues for {data?.name} </h1>
            <Masonry items={venues.data ? venues.data : []} facility={facilityId} />

            {membership?.role === "admin" ? (
            <CreateVenue facilityId={facilityId} />
            ) : null}

        </>
    )
}