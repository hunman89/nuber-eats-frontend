import { waitFor } from "@testing-library/react";
import React from "react";
import { NotFound } from "../404";
import { render } from "../../test-utils";

describe("<NotFound />", () => {
  it("render OK", async () => {
    render(<NotFound />);
    await waitFor(() => {
      expect(document.title).toBe("Not Found | Nuber Eats");
    });
  });
});
