import { api } from "@/utils/api";
import { useOrganization } from "@clerk/nextjs";
import CreateVenue from "./create";

export default function Venues({ facilityId }: { facilityId: string }) {

    const { organization, membership } = useOrganization();
    const { data } = api.facility.getOne.useQuery({ facilityId: facilityId });
    if (!organization) return null
    const facilities = api.venue.getAllByFacilityId.useQuery({ facilityId: facilityId });
    console.log(facilities.data)
    return (
        <div>
            <h1>Venues for {data?.name} </h1>
            <ul>
                {facilities.data?.map((facility) => (
                    <li key={facility.id}>
                        <p>{facility.name}</p>
                    </li>
                ))}
            </ul>
            {membership?.role === "admin" ? (
            <CreateVenue facilityId={facilityId} />
            ) : null}

        </div>
    )
}