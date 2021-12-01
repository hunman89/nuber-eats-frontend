import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IFormProps {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: { input: { id: +restaurantId } },
      },
    ],
  });
  const {
    register,
    getValues,
    formState: { isValid },
    handleSubmit,
    setValue,
  } = useForm<IFormProps>({ mode: "onChange" });
  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const optionObject = optionsNumber.map((theId) => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionObject,
        },
      },
    });
    history.goBack();
  };
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h1 className="font-semibold text-2xl mb-3">Add Dish</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt05 w-full mb-5"
      >
        <input
          {...register("name", {
            required: "Name is required",
          })}
          placeholder="Name"
          className="input"
          type="text"
        />
        <input
          {...register("price", {
            required: "price is required",
          })}
          placeholder="Price"
          min={0}
          className="input"
          type="number"
        />
        <input
          {...register("description", {
            required: "description is required",
          })}
          placeholder="Description"
          className="input"
          type="text"
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-lime-600 pt-1 px-2 mt-5 "
          >
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  className="py-2 px-4 focus:border-gray-600 border-2 mr-3 focus:outline-none"
                  type="text"
                  placeholder="Option Name"
                  {...register(`${id}-optionName`)}
                />
                <input
                  className="py-2 px-4 focus:border-gray-600 border-2 focus:outline-none"
                  type="number"
                  min={0}
                  placeholder="Option Extra"
                  {...register(`${id}-optionExtra`)}
                />
                <span
                  onClick={() => onDeleteClick(id)}
                  className="cursor-pointer ml-6"
                >
                  Delete Option
                </span>
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Create Dish"
        ></Button>
      </form>
    </div>
  );
};
