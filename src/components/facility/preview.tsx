import { type Facility } from "@prisma/client";

export default function FacilityPreview({ facility }: { facility: Facility | undefined }) {
    if (!facility) return null;
    return <h1>{facility.name}</h1>;
}