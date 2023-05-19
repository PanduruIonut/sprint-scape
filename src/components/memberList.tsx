import type {
    MembershipRole,
    OrganizationMembershipResource,
} from "@clerk/types";
import { useState } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";

export default function MemberList() {
    const { membershipList, membership } = useOrganization({
        membershipList: {},
    });

    if (!membershipList) {
        return null;
    }

    const isCurrentUserAdmin = membership?.role === "admin";

    return (
        <div style={{ paddingTop: '10px' }}>
            <h2>Members:</h2>
            <ul>
                {membershipList.map((m) => (
                    <li key={m.id}>
                        {m.publicUserData.firstName} {m.publicUserData.lastName} &lt;
                        {m.publicUserData.identifier}&gt; :: {m.role}
                        {isCurrentUserAdmin && <AdminControls membership={m} />}
                    </li>
                ))}
            </ul>
        </div>
    );
}

const AdminControls = ({
    membership,
}: {
    membership: OrganizationMembershipResource;
}) => {
    const [disabled, setDisabled] = useState(false);
    const { user } = useUser();
    const userId = user?.id;

    if (membership.publicUserData.userId === userId) {
        return null;
    }

    const remove = async () => {
        setDisabled(true);
        await membership.destroy();
    };

    const changeRole = async (role: MembershipRole) => {
        setDisabled(true);
        await membership.update({ role });
        setDisabled(false);
    };

    return (
        <>
            ::{" "}
            <button disabled={disabled} onClick={void remove}>
                Remove member
            </button>{" "}
            {membership.role === "admin" ? (
                <button disabled={disabled} onClick={() => void changeRole("basic_member")}>
                    Change to member
                </button>
            ) : (
                <button disabled={disabled} onClick={() => void changeRole("admin")}>
                    Change to admin
                </button>
            )}
        </>
    );
};
