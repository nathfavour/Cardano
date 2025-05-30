import { expect, test } from "vitest";
import { Effect } from "effect";
import { LucidContext, makeLucidContext } from "./service/lucidContext.js";
import { createAccountTestCase } from "./createAccountTestCase.js";



test<LucidContext>("Test 4 - Create Account", async () => {
  console.log("Test started");

  try {
    const program = Effect.gen(function* (_) {
      console.log("Inside Effect.gen start");
      const context = yield* makeLucidContext();
      console.log("Got context:", context);
      const result = yield* createAccountTestCase(context);
      console.log("Got result:", result);
      return result;
    });

    console.log("Running Effect.runPromise");
    const result = await Effect.runPromise(program);

    console.log("Effect.runPromise finished with:", result);

    expect(result.txHash).toBeDefined();
    expect(typeof result.txHash).toBe("string");
    expect(result.accountConfig).toBeDefined();
  } catch (err) {
    console.error("Test failed with error:", err);
    throw err;
  }

  console.log("Test ended");
});
