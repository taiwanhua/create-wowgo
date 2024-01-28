#!/usr/bin/env node

import { join } from "node:path";
import { createProject } from "../lib/starter.js";

const projectName = getDestination(process.argv[2]);

function getDestination(destFolder = "my-wowgo-project") {
  return join(process.cwd(), destFolder);
}

createProject(projectName);
