import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/services/profile/profileService";

const useMyProfile = () =>
  useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
    retry: false,
  });

export default useMyProfile;
