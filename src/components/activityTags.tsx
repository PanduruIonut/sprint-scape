import { type Activity } from "@prisma/client";
import ActivityTag from "./activityTag";

export default function ActivityTags({ activities }: { activities: Activity[] }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {activities.slice(0, 5).map((activity: Activity) => <ActivityTag key={activity.id} activity={activity} />)}
        </div>
    )
}
