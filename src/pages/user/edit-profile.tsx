import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import {
  editProfile,
  editProfileVariables,
} from "../../__generated__/editProfile";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData, refetch } = useMe();
  const onCompleted = async (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      await refetch();
    }
  };
  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, { onCompleted });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-3"
      >
        <input
          {...register("email", {
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          {...register("password")}
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};
