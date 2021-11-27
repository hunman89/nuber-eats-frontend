describe("Edit Profile", () => {
  const user = cy;
  beforeEach(() => {
    //@ts-ignore
    user.login("hunman@naver.com", "1111");
  });
  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.title().should("eq", "Edit Profile | Nuber Eats");
  });
  it("can change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "editProfile") {
        // @ts-ignore
        req.body?.variables?.input?.email = "nico@nomadcoders.co";
      }
    });
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear().type("new@naver.com");
    user.findByRole("button").click();
  });
});
