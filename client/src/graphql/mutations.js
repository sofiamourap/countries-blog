import { USER_INFO } from "./fragments";
import { gql } from "apollo-boost";

export const USER_UPDATE = gql`
  mutation userUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      ...userInfo
    }
  }
  ${USER_INFO}
`;
