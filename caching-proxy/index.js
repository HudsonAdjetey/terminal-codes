#!/usr/bin/env node

const http = require("http");
const axios = require("axios");
// node cache
const NodeCache = require("node-cache");
const yargs = require("yargs");

const cache = new NodeCache({ stdTTL: 600, checkperiod: 60 });

const argv = yargs
  .option("port", {
    alias: "p",
    description: "Port number for the server",
    type: "number",
    default: 3000,
    demandOption: true,
  })
  .option("origin", {
    alias: "o",
    description: "Origin URL for the API",
    type: "string",
    demandOption: true,
  })
  .option("clear-cache", {
    alias: "c",
    description: "Clear the cache",
    type: "boolean",
    default: false,
  })
  .help().argv;

const port = argv.port;
const origin = argv.origin;

// function to clear the cache
if (argv["clear-cache"]) {
  cache.flushAll();
  console.log("Cache cleared successfully");
  process.exit(0);
}

// start the caching proxy server
const server = http.createServer(async (req, res) => {
  const url = `${origin}${req.url}`;

  // check if the response is cached
  if (cache.has(url)) {
    console.log("Cache HIT");
    const cachedResponse = cache.get(url);
    res.writeHead(200, { ...cachedResponse.headers, "X-Cache": "HIT" });
    return res.end(JSON.stringify(cachedResponse.body));
  }

  try {
    console.log("Cache MISS");
    // Forward the request to the origin server
    const response = await axios.get(url);
    const { data, headers } = response;

    // store the response in the cache
    cache.set(url, { headers, body: data });

    // send response back to client
    res.writeHead(200, { ...headers, "X-Cache": "MISS" });
    return res.end(JSON.stringify(data));
  } catch (error) {
    console.error("Error forwarding request:", error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    return res.end("Error forwarding request.");
  }
});

// start listening
server.listen(port, () => {
  console.log(`Caching proxy server running on port ${port}`);
});
