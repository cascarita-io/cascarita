"use strict";
const { randomUUID } = require("crypto");
const bs58 = require("bs58").default;

function generatePaymentIntentId() {
  const uuid = randomUUID();
  const buffer = Buffer.from(uuid.replace(/-/g, ""), "hex");
  const encoded = bs58.encode(buffer);

  //'ca_pi_' prefix indicates that it's a cascarita payment intent id
  return `ca_pi_${encoded}`;
}

module.exports = generatePaymentIntentId;
