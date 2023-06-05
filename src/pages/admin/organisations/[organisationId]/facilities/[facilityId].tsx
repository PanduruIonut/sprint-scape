
import Venues from "@/components/venue/venues";
import { Card, Center } from "@chakra-ui/react";

export default function Facility() {
    return (
        <Center height='100vh' width='100vw'>
            <Card boxShadow='2xl' variant='outline' align='center' minWidth='md'>
                <Venues />
            </Card>
        </Center>
    )
}