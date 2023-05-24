
import { api } from "@/utils/api";
import { useOrganization } from "@clerk/nextjs";
import { type Facility } from "@prisma/client";

export default function Facilities() {
    const { organization, isLoaded } = useOrganization();
    if (!organization) return null
    const facilities = api.facility.getAllByOrganizationId.useQuery({ organisationId: organization.id });
    return (
        <div>
            {isLoaded ? (
                <div>
                    <h1>Facilities for {organization.name}</h1>
                    <ul>
                        {facilities.data?.map((facility: Facility) => (
                            <li key={facility.id}>{facility.name}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );

}