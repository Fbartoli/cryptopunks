import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Transaction: p.createTable({
    id: p.string(),
    punk: p.string().references("Punk.id"),
    PunkId: p.one("punk"),
    value: p.string(),
    from: p.string(),
    to: p.string(),
    blocknumber: p.bigint(),
    date: p.string(),
  }),
  Bid: p.createTable({
    id: p.string(),
    punk: p.string().references("Punk.id"),
    PunkId: p.one("punk"),
    bidder: p.string(),
    value: p.string(),
    date: p.string(),
  }),
  Punk: p.createTable({
    id: p.string(),
    transactions: p.many("Transaction.punk"),
    BidId: p.string().references("Bid.id").optional(),
    HighestBid: p.one("BidId"),
  }),
}));
