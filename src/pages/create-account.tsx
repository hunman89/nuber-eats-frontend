import { gql, useMutation } from "@apollo/client";
import React from "react";
import Helmet from "react-helmet";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
import { UserRole } from "../__generated__/globalTypes";

const CREATE_ACCOUNT_MUTAION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<ICreateAccountForm>({
    mode: "onBlur",
    defaultValues: { role: UserRole.Client },
  });

  const [createAccountMutation] = useMutation(CREATE_ACCOUNT_MUTAION, {});
  const onSubmit = () => {};
  console.log(watch());
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Nuber</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} alt="" className="w-60 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl">
          Let's get started
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-3"
        >
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email"
            className="input"
          ></input>
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            {...register("password", {
              required: "Password is required",
            })}
            type="password"
            placeholder="Password"
            className="input"
          ></input>
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <select {...register("role", { required: true })} className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={isValid}
            loading={false}
            actionText={"Create Account"}
          />
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/login" className=" text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};
