
import { api } from "@/utils/api";
import { useOrganization } from "@clerk/nextjs";
import { type Facility } from "@prisma/client";
import Link from "next/link";

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
                            <Link href={`/admin/organisations/${organization.id}/facilities/${facility.id}`} key={facility.id}>
                                <li key={facility.id}>{facility.name}</li>
                            </Link>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );

}