import Venues from "@/components/venue/venues";
import { Card, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Facility() {
    const router = useRouter()
    const facilityId = router.query.facilityId as string
    return (
        <Center height='100vh' width='100vw'>
            <Card boxShadow='2xl' variant='outline' align='center' minWidth='md'>
                <Venues facilityId={facilityId} />
            </Card>
        </Center>
    )
}
