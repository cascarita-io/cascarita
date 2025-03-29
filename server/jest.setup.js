import React from "react";

import "@testing-library/jest-dom";

global.React = React;

const util = require("util");

if (typeof TextEncoder === "undefined") {
  global.TextEncoder = util.TextEncoder;
}

if (typeof TextDecoder === "undefined") {
  global.TextDecoder = util.TextDecoder;
}
