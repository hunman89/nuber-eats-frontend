import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import { Login, LOGIN_MUTAION } from "../login";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(async () => {
      mockedClient = createMockClient();
      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>
      );
    });
  });
  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });
  it("displays email validation errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const pw = getByPlaceholderText(/password/i);
    await waitFor(() => {
      userEvent.type(email, "asdasd@dsads");
      userEvent.type(pw, "asd");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    await waitFor(() => {
      userEvent.clear(email);
      userEvent.type(pw, "asd");
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });
  it("display password required errord", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole("button");
    await waitFor(() => {
      userEvent.type(email, "this@asd.com");
      userEvent.click(submitBtn);
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });
  it("submits from and calls mutation", async () => {
    const formData = {
      email: "real@test.com",
      password: "123",
    };

    const { getByPlaceholderText, getByRole } = renderResult;

    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole("button");

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: { ok: true, token: "XXX", error: "mutation-error" },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTAION, mockedMutationResponse);

    jest.spyOn(Storage.prototype, "setItem");

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });

    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      LoginInput: {
        email: formData.email,
        password: formData.password,
      },
    });

    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/mutation-error/i);
    expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "XXX");
  });
});
