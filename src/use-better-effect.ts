import { useEffect } from "react";

interface UseBetterEffectBase {
  callbackFn: () => void;
  cleanupFn?: () => void;
  runCondition: "ON_MOUNT" | "EVERY_RENDER" | "DEPENDENCIES_CHANGED";
  dependencies?: unknown[];
}

interface UseBetterEffectOnMount
  extends Omit<UseBetterEffectBase, "dependencies"> {
  runCondition: "ON_MOUNT";
}
interface UseBetterEffectEveryRender
  extends Omit<UseBetterEffectBase, "dependencies"> {
  runCondition: "EVERY_RENDER";
}
interface UseBetterEffectDepsChanged extends UseBetterEffectBase {
  runCondition: "DEPENDENCIES_CHANGED";
  dependencies: unknown[];
}

export function useBetterEffect({
  callbackFn,
  cleanupFn,
}: UseBetterEffectOnMount): ReturnType<typeof useEffect>;
export function useBetterEffect({
  callbackFn,
  cleanupFn,
}: UseBetterEffectEveryRender): ReturnType<typeof useEffect>;
export function useBetterEffect({
  callbackFn,
  cleanupFn,
  dependencies,
}: UseBetterEffectDepsChanged): ReturnType<typeof useEffect>;
export function useBetterEffect({
  callbackFn,
  cleanupFn,
  dependencies,
  runCondition,
}: UseBetterEffectBase): ReturnType<typeof useEffect> {
  let deps: unknown[] | undefined;

  if (runCondition === "ON_MOUNT") {
    deps = [];
  } else if (runCondition === "EVERY_RENDER") {
    deps = undefined;
  } else if (runCondition === "DEPENDENCIES_CHANGED") {
    deps = dependencies;
  }

  return useEffect(() => {
    callbackFn();
    return cleanupFn;
  }, deps);
}
