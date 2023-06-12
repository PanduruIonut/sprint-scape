import { Button, Card, CardBody, CardFooter, Image } from "@chakra-ui/react";
import { type Facility } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

export default function FacilityPreview({ facility, onClose }: { facility: Facility | undefined, onClose: () => void }) {
    const [isOpen, setIsOpen] = useState(true)
    const router = useRouter();
    if (!facility) return null;

    function closeDialog() {
        setIsOpen(false);
        onClose();
    }
    function visit(facility: Facility) {
        if (!facility) return
        void router.push(`/facilities/${facility.id}`);
        setIsOpen(false);
        onClose();
    }

    return (
        <Card style={{
            display: isOpen ? 'block' : 'none',
            position: 'absolute',
            top: '57%',
            left: '30%',
            zIndex: 1,
            transform: 'translate(-50%, -50%)',
            width: '320px',
            height: '550px',
            textAlign: 'center',
            justifyContent: 'center',
        }} boxShadow='2xl' variant='outline'>
            <CardBody style={{}}>
                <Image alt="" src="https://www.abonamentesali.ro/storage/gyms/green-diamond-sala-fitness-sibiu-esx-01-20210812-184505-291.jpg" style={{ textAlign: 'center' }} />
                <p style={{ fontSize: '17', fontWeight: 'bold', padding: '8px' }}>{facility.name}</p>
                <p style={{ fontStyle: 'italic', padding: '8px', fontSize: '11px' }}>{facility.address}</p>
                <p>{facility.description}</p>
            </CardBody>
            <CardFooter justifyContent={'center'}>
                <Button onClick={closeDialog}>Close</Button>
                <Button onClick={() => visit(facility)}>Visit</Button>
            </CardFooter>
        </Card >
    )
}