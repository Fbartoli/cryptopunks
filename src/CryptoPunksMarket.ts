import { ponder } from "@/generated";
import { randomUUID } from "crypto";
import { formatEther, parseEther } from "viem";
import { writeFileSync } from "fs";

ponder.on("CryptoPunksMarket:PunkBought", async ({ event, context }) => {
  const { Transaction, Punk, Bid } = context.db;

  const punk = await Punk.upsert({
    id: event.args.punkIndex.toString(),
  });
  let value = event.args.value;
  let to = event.args.toAddress.toString();
  if (punk.BidId && event.args.value == 0n) {
    let bid = await Bid.findUnique({ id: punk.BidId });
    if (bid) {
      value =
        event.args.value == 0n ? parseEther(bid!.value) : event.args.value;
      to = bid.bidder;
    }
  }
  await Transaction.create({
    id: randomUUID(),
    data: {
      value: formatEther(value),
      punk: punk.id,
      to,
      from: event.args.fromAddress,
      date: new Date(Number(event.block.timestamp) * 1000).toISOString(),
      blocknumber: event.block.number,
    },
  });
  writeFileSync(
    "../data/txPunks.csv",
    `${punk.id};${formatEther(value)};${to};${
      event.args.fromAddress
    };${new Date(Number(event.block.timestamp) * 1000).toISOString()};${
      event.block.number
    }\n`,
    { flag: "a" }
  );
});

ponder.on("CryptoPunksMarket:PunkBidEntered", async ({ event, context }) => {
  const { Bid, Punk } = context.db;

  const bid = await Bid.create({
    id: randomUUID(),
    data: {
      value: formatEther(event.args.value),
      punk: event.args.punkIndex.toString(),
      bidder: event.args.fromAddress,
      date: new Date(Number(event.block.timestamp) * 1000).toISOString(),
    },
  });
  Punk.upsert({
    id: event.args.punkIndex.toString(),
    update: {
      BidId: bid.id,
    },
    create: {
      BidId: bid.id,
    },
  });
});

ponder.on("CryptoPunksMarket:PunkBidWithdrawn", async ({ event, context }) => {
  const { Punk } = context.db;
  Punk.upsert({
    id: event.args.punkIndex.toString(),
    update: {
      BidId: undefined,
    },
    create: {
      BidId: undefined,
    },
  });
});
