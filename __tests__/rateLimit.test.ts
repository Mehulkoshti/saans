import { describe, expect, it } from "vitest";
import { isRateLimited } from "@/lib/rateLimit";

describe("isRateLimited", () => {
  it("allows the first request for a fresh key", () => {
    expect(isRateLimited(`key-${Date.now()}-a`)).toBe(false);
  });

  it("blocks after exceeding the per-window limit", () => {
    const key = `key-${Date.now()}-b`;
    let blocked = false;
    for (let i = 0; i < 25; i++) {
      blocked = isRateLimited(key);
    }
    expect(blocked).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const keyA = `key-${Date.now()}-c`;
    const keyB = `key-${Date.now()}-d`;
    for (let i = 0; i < 21; i++) isRateLimited(keyA);
    expect(isRateLimited(keyB)).toBe(false);
  });
});
