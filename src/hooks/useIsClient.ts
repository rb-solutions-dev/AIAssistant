import { useOrganization } from "@clerk/nextjs";
export enum Client {
  Texas = "org_2sgG0F9XuHSO1e2GpkFVEeQLs3S",
  Tamaulipas = "org_2sSD2TRyh1DJFfyqVfEWx8mT7dS",
}

export const useIsClient = (client: Client) => {
  const { isLoaded, organization } = useOrganization();

  if (!isLoaded || !organization) return false;

  return organization.id === client;
};
