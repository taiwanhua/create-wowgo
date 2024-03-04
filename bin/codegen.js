#!/usr/bin/env node

import { dirname, join } from "node:path";
import { createProject } from "../lib/starter.js";

export const latestTurbo = "1.12.4";
export const defaultDestFolder = "my-wowgo-project";

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
