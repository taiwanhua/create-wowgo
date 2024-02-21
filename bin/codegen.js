#!/usr/bin/env node

import { dirname, join } from "node:path";
import { createProject } from "../lib/starter.js";

const latestTurbo = "1.11.3";
const defaultDestFolder = "my-wowgo-project";

const destFolder = process.argv[2] ?? defaultDestFolder;
const projectPath = getDestination(destFolder);
const projectParentPath = dirname(projectPath);
const turboVersion = process.argv[3] ?? latestTurbo;

function getDestination(destFolder) {
  return join(process.cwd(), destFolder);
}

createProject({
  projectName: destFolder,
  projectPath,
  projectParentPath,
  turboVersion,
});
