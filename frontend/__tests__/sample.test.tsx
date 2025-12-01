import { render, screen } from "@testing-library/react";

function SampleComponent() {
  return <div>Ciao test</div>;
}

describe("SampleComponent", () => {
  it("renders text correctly", () => {
    render(<SampleComponent />);
    expect(screen.getByText("Ciao test")).toBeInTheDocument();
  });
});
