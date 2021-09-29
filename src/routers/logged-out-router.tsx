import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface IForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();
  const onSubmit = () => {
    console.log(watch());
  };
  const onInvalid = () => {
    console.log("cant create account");
  };

  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            {...register("email", {
              required: "This is required",
              pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
            })}
            name="email"
            type="email"
            placeholder="email"
          />
          {errors.email && "this is required"}
          {errors.email?.type === "pattern" && (
            <span className="font-bold text-red-700">only gmail allowed</span>
          )}
          <input type="submit"></input>
        </div>
        <div>
          <input
            {...register("password", { required: true })}
            name="password"
            type="password"
            placeholder="password"
          />
        </div>
      </form>
    </div>
  );
};
