import { ponder } from "@/generated";

ponder.on("CryptoPunksMarket:Assign", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("CryptoPunksMarket:Transfer", async ({ event, context }) => {
  console.log(event.args);
});
