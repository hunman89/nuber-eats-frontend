describe("Log In", () => {
  const user = cy;
  it("should see login page", () => {
    user.visit("/").title().should("eq", "Login | Nuber Eats");
  });
  it("can fill out the form", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("hunman89@gmail.com");
    user.findByPlaceholderText(/password/i).type("1212");
    user.findByRole("button").should("not.have.class", "pointer-events-none");
  });
  it("can see email / password validation errors", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("hunman89@gmail");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
  });
});
