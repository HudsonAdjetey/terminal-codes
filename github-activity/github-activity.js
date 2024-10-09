#!/usr/bin/env node
const axios = require("axios");

const fetchGithubActivity = async (username) => {
  const urlEndpoint = `https://api.github.com/users/${username}/events`;

  try {
    const response = await axios.get(urlEndpoint);
    const events = response.data;

    // check if the event is less than 0
    if (events.length === 0) {
      console.log("No GitHub events found for this user.");
      return;
    }
    console.log(`Recent activity for the user: ${username}`);

    //  display all the activity -> recent events
    events.forEach((event) => {
      let gitActions = "";

      //   using switch cases <-> the actions performed
      switch (event.type) {
        case "IssuesEvent":
          gitActions = `opened an issue in the repo ${event.repo.name}`;
          break;
        case "PushEvent":
          gitActions = `pushed to the repo ${event.repo.name} - commit(s) -> ${event.payload.commits.length} `;
          break;
        case "CreateEvent":
          gitActions = `created a new branch in the repo ${event.repo.name}`;
          break;
        case "WatchEvent":
          gitActions = `watched the repo ${event.repo.name}`;
          break;
        default:
          gitActions = `Performed an unknown action: ${event.type} in ${event.repo.name}`;
          break;
      }
      console.log(`Git Actions: -${gitActions}`);
    });
  } catch (error) {
    console.error("Error fetching GitHub events:", error.message);
  }
};
// getting the argument from the terminal

const username = process.argv[2];
if (!username) {
  console.error("Please provide a GitHub username as an argument.");
} else {
  fetchGithubActivity(username);
}
