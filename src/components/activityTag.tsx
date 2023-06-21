import { Image } from '@chakra-ui/react'
import { type ActivityType, type Activity } from '@prisma/client'
import footBallIcon from '../../public/icons/football.png'
import { type StaticImageData } from 'next/image';
import basketballIcon from '../../public/icons/basketball.png'
import tennisIcon from '../../public/icons/tennis-outside.png'
import badmintonIcon from '../../public/icons/badminton.png'
import handballIcon from '../../public/icons/handball.png'
import volleyballIcon from '../../public/icons/volleyball.png'
import tableTennisIcon from '../../public/icons/tennis.png'


export default function ActivityTag({ activity }: { activity: Activity }) {


    type ActivityIcons = {
        [key in ActivityType]: StaticImageData | string;
    };

    const activityIcons: ActivityIcons = {
        BASKETBALL: basketballIcon,
        BADMINTON: badmintonIcon,
        FOOTBALL: footBallIcon,
        HANDBALL: handballIcon,
        TENNIS: tennisIcon,
        TABLE_TENNIS: tableTennisIcon,
        VOLLEYBALL: volleyballIcon,
    };

    const activityIcon: string | StaticImageData = activityIcons[activity.type];
    const iconSrc = typeof activityIcon === 'string' ? activityIcon : activityIcon.src;


    return (
        <Image
            src={iconSrc}
            alt=''
            boxSize="30px"
            objectFit="cover"
            style={{ margin: '5px', borderRadius: '50%', border: '1px solid black', padding: '5px' }}
        />
    )
}