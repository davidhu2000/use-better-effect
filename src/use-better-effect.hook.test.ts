import { renderHook } from "@testing-library/react";
import { useEffect } from "react";

import { useBetterEffect } from "./use-better-effect";

describe("useBetterEffect", () => {
  describe('runCondition: "ON_MOUNT"', () => {
    it("should run callbackFn on mount", () => {
      const callbackFn = jest.fn();
      renderHook(() =>
        useBetterEffect({ callbackFn, runCondition: "ON_MOUNT" })
      );
      expect(callbackFn).toHaveBeenCalledTimes(1);
    });

    it("should not run callbackFn on rerenders", () => {
      const callbackFn = jest.fn();
      const { rerender } = renderHook(() => {
        useBetterEffect({
          callbackFn,
          runCondition: "ON_MOUNT",
        });
      });
      expect(callbackFn).toHaveBeenCalledTimes(1);
      rerender();
      expect(callbackFn).toHaveBeenCalledTimes(1);
    });

    it("should run cleanupFn on unmount", () => {
      const cleanupFn = jest.fn();
      const { unmount } = renderHook(() =>
        useBetterEffect({
          callbackFn: () => {},
          cleanupFn,
          runCondition: "ON_MOUNT",
        })
      );
      expect(cleanupFn).toHaveBeenCalledTimes(0);
      unmount();
      expect(cleanupFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('runCondition: "EVERY_RENDER"', () => {
    it("should run callbackFn on mount", () => {
      const callbackFn = jest.fn();
      renderHook(() =>
        useBetterEffect({ callbackFn, runCondition: "EVERY_RENDER" })
      );
      expect(callbackFn).toHaveBeenCalledTimes(1);
    });

    it("should run callbackFn on every render", () => {
      const callbackFn = jest.fn();
      const { rerender } = renderHook(() =>
        useBetterEffect({ callbackFn, runCondition: "EVERY_RENDER" })
      );
      expect(callbackFn).toHaveBeenCalledTimes(1);
      rerender();
      expect(callbackFn).toHaveBeenCalledTimes(2);
      rerender();
      expect(callbackFn).toHaveBeenCalledTimes(3);
    });

    it("should run cleanupFn on unmount", () => {
      const cleanupFn = jest.fn();
      const { unmount } = renderHook(() =>
        useBetterEffect({
          callbackFn: () => {},
          cleanupFn,
          runCondition: "EVERY_RENDER",
        })
      );
      expect(cleanupFn).toHaveBeenCalledTimes(0);
      unmount();
      expect(cleanupFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('runCondition: "DEPENDENCIES_CHANGED"', () => {
    it("should run callbackFn on mount", () => {
      const callbackFn = jest.fn();
      renderHook(() =>
        useBetterEffect({
          callbackFn,
          runCondition: "DEPENDENCIES_CHANGED",
          dependencies: [1, 2, 3],
        })
      );
      expect(callbackFn).toHaveBeenCalledTimes(1);
    });

    it.only("should run callbackFn on dependencies changed", () => {
      const callbackFn = jest.fn();
      const { rerender } = renderHook(
        ({ dependencies }) => useEffect(callbackFn, dependencies),
        { initialProps: { dependencies: [1, 2, 3] } }
      );
      expect(callbackFn).toHaveBeenCalledTimes(1);
      rerender({ dependencies: [2, 3, 4] });
      expect(callbackFn).toHaveBeenCalledTimes(2);
    });

    it("should not run cleanupFn on dependencies changed", () => {
      const cleanupFn = jest.fn();
      const { rerender } = renderHook(
        ({ dependencies }) =>
          useBetterEffect({
            callbackFn: () => {},
            cleanupFn,
            runCondition: "DEPENDENCIES_CHANGED",
            dependencies,
          }),
        { initialProps: { dependencies: [1, 2, 3] } }
      );
      expect(cleanupFn).toHaveBeenCalledTimes(0);
      rerender({ dependencies: [1, 2, 3, 4] });
      expect(cleanupFn).toHaveBeenCalledTimes(0);
    });

    it("should run cleanupFn on unmount", () => {
      const cleanupFn = jest.fn();
      const { unmount } = renderHook(() =>
        useBetterEffect({
          callbackFn: () => {},
          cleanupFn,
          runCondition: "DEPENDENCIES_CHANGED",
          dependencies: [1, 2, 3],
        })
      );
      expect(cleanupFn).toHaveBeenCalledTimes(0);
      unmount();
      expect(cleanupFn).toHaveBeenCalledTimes(1);
    });
  });
});
