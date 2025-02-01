"use client";

import { useState, useCallback, useEffect } from "react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { type UserOrganizationInvitationResource } from "@clerk/types";

const SetActiveOrganizationTrigger = () => {
  const [notFound, setNotFound] = useState(false);
  const [isAcceptingInvitationManually, setIsAcceptingInvitationManually] =
    useState(false);

  const { isLoaded, userMemberships, setActive, userInvitations } =
    useOrganizationList({
      userInvitations: {
        keepPreviousData: true,
      },
      userMemberships: {
        keepPreviousData: true,
      },
    });

  const handleAcceptInvite = useCallback(
    async (invitation: UserOrganizationInvitationResource) => {
      setIsAcceptingInvitationManually(true);

      try {
        await invitation.accept();
        setActive?.({ organization: invitation.publicOrganizationData.id });
      } catch (error) {
        return error;
      }
    },
    [setActive, setIsAcceptingInvitationManually]
  );

  useEffect(() => {
    if (isLoaded && userMemberships) {
      setNotFound(false);

      if (userMemberships.data.length > 0) {
        const org = userMemberships.data[0];
        setActive({ organization: org.organization.id });
      } else if (userInvitations.data?.length > 0) {
        if (isAcceptingInvitationManually === false) {
          const invitation = userInvitations.data[0];
          handleAcceptInvite(invitation);
        }
      } else {
        setNotFound(true);
      }
    }
  }, [
    isLoaded,
    userMemberships,
    userInvitations,
    setActive,
    isAcceptingInvitationManually,
    handleAcceptInvite,
  ]);

  if (notFound) {
    return (
      <div className="h-full pb-12 flex justify-center items-center">
        <h1 className="text-2xl font-semibold">
          Please message your administrator to add you to an organization.
        </h1>
      </div>
    );
  }

  return null;
};

const OrganizationProxy = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, organization } = useOrganization();

  if (isLoaded) {
    if (organization === null) {
      return <SetActiveOrganizationTrigger />;
    }

    return <>{children}</>;
  }

  return null;
};

export default OrganizationProxy;
