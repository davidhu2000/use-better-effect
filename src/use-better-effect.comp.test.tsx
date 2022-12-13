import { useState } from "react";
import { act, render } from "@testing-library/react";
import { useBetterEffect } from "./index";

describe("useBetterEffect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("runCondition: ON_MOUNT", () => {
    const TestComponent = () => {
      const [count, setCount] = useState(0);
      useBetterEffect({
        callbackFn: () => {
          setCount(count + 1);
        },
        runCondition: "ON_MOUNT",
      });
      return <div>{count}</div>;
    };

    it("should update count to 1 on mount", () => {
      const wrapper = render(<TestComponent />);
      expect(wrapper.queryByText("1")).toBeTruthy();
    });

    it("should not update count on rerender", () => {
      const wrapper = render(<TestComponent />);
      expect(wrapper.queryByText("1")).toBeTruthy();
      wrapper.rerender(<TestComponent />);
      expect(wrapper.queryByText("1")).toBeTruthy();
      wrapper.rerender(<TestComponent />);
      expect(wrapper.queryByText("1")).toBeTruthy();
    });
  });

  describe("runCondition: EVERY_RENDER", () => {
    const someFn = jest.fn();
    const TestComponent = () => {
      useBetterEffect({
        callbackFn: () => {
          someFn();
        },
        runCondition: "EVERY_RENDER",
      });
      return <div>EVERY_RENDER</div>;
    };

    it("should call someFn on mount", () => {
      render(<TestComponent />);
      expect(someFn).toHaveBeenCalledTimes(1);
    });

    it("should call someFn on rerender", () => {
      const wrapper = render(<TestComponent />);
      expect(someFn).toHaveBeenCalledTimes(1);
      wrapper.rerender(<TestComponent />);
      expect(someFn).toHaveBeenCalledTimes(2);
      wrapper.rerender(<TestComponent />);
      expect(someFn).toHaveBeenCalledTimes(3);
    });
  });

  describe("runCondition: DEPENDENCIES_CHANGED", () => {
    const someFn = jest.fn();
    const TestComponent = () => {
      const [count, setCount] = useState(0);
      useBetterEffect({
        callbackFn: someFn,
        runCondition: "DEPENDENCIES_CHANGED",
        dependencies: [count],
      });

      return (
        <div>
          <div>{count}</div>
          <button onClick={() => setCount(count + 1)}>click</button>
        </div>
      );
    };

    it("should call someFn and render initial count on mount", () => {
      const wrapper = render(<TestComponent />);
      expect(wrapper.queryByText("0")).toBeTruthy();
      expect(someFn).toHaveBeenCalledTimes(1);
    });

    it("should call someFn when count changes", async () => {
      const wrapper = render(<TestComponent />);
      expect(wrapper.queryByText("0")).toBeTruthy();
      expect(someFn).toHaveBeenCalledTimes(1);
      act(() => {
        wrapper.getByText("click").click();
      });
      expect(wrapper.queryByText("1")).toBeTruthy();
      expect(someFn).toHaveBeenCalledTimes(2);
      act(() => {
        wrapper.getByText("click").click();
      });
      expect(wrapper.queryByText("2")).toBeTruthy();
      expect(someFn).toHaveBeenCalledTimes(3);
    });

    it("should not call someFn when component rerenders by deps did not change", () => {
      const wrapper = render(<TestComponent />);
      expect(wrapper.queryByText("0")).toBeTruthy();
      expect(someFn).toHaveBeenCalledTimes(1);
      wrapper.rerender(<TestComponent />);
      expect(wrapper.queryByText("0")).toBeTruthy();
      expect(someFn).toHaveBeenCalledTimes(1);
    });
  });
});
