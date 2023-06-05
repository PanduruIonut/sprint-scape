import Facilities from "@/components/facility/facilities";
import { Card, Center } from "@chakra-ui/react";

export default function FacilitiesPreview() {
    return (
        <Center height='100vh' width='100vw'>
            <Card boxShadow='2xl' variant='outline' align='center' minWidth='md'>
                <Facilities />
            </Card>
        </Center>
    )
}