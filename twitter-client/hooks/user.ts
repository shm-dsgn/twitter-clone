import { graphqlClient } from "@/clients/api";
import { getCurrentUserQuery } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

interface CurrentUserResponse {
    getCurrentUser: {
      // define the properties of the user here
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        profileImageURL: string;
    };
  }

export const useCurrentUser = () => {
  const query = useQuery<CurrentUserResponse>({
    queryKey: ["current-user"],
    queryFn: () => graphqlClient.request(getCurrentUserQuery),
  });

  return { ...query, user: query.data?.getCurrentUser };
};