import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { readdir } from "node:fs";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import copy from "copy-template-dir";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readDir = promisify(readdir);

/**
 * @method getDirectories
 * @description Get the templates directory.
 */
const getTemplateDir = async () => {
  const contents = await readDir(`${__dirname}/packages`, {
    withFileTypes: true,
  });
  const directories = contents
    .filter((p) => p.isDirectory())
    .map((p) => p.name);

  return directories;
};

/**
 * @method chooseTemplates
 * @description Choose a template.
 */
const chooseTemplates = async () => {
  const directories = await getTemplateDir();
  const { chooseTemplates } = await inquirer.prompt([
    {
      type: "list",
      name: "chooseTemplates",
      message: "Select a template",
      choices: [...directories, new inquirer.Separator()],
    },
  ]);

  return chooseTemplates;
};

/**
 * @method succeedConsole
 * @description When the project is successful, the console is displayed.
 */
const succeedConsole = async (template, spinner) => {
  spinner.succeed(chalk.green(`Complete setup project.`));

  const msg =
    {
      prisma:
        "⛰ Prisma installed. Check your .env settings and to get more info please see : https://www.prisma.io/docs/getting-started/quickstart",
    }[template] ?? "";

  msg && console.log(msg);
};

/**
 * @method failConsole
 * @description When the project is fail, the console is displayed.
 */
const failConsole = async (error, spinner) => {
  spinner.fail(
    chalk.red(`Please leave this error as an issue
  Please see : https://github.com/taiwanhua/create-wowgo/issues`),
  );

  console.error(error);
};

/**
 * @method createProject
 * @description Create a project
 */
export const createProject = async (projectName) => {
  let spinner;

  const vars = { foo: "bar", test: "tttt", test2: "222" };
  //   const inDir = path.join(__dirname, "templates");
  //   const outDir = path.join(__dirname, "dist");
  //   console.log(inDir, outDir);
  //   copy(inDir, outDir, vars, (err, createdFiles) => {
  //     if (err) throw { err };
  //     createdFiles.forEach((filePath) => console.log(`Created ${filePath}`));
  //     console.log("done!");
  //   });

  try {
    const template = await chooseTemplates();
    // const isUpdated = await dependenciesUpdates();
    // const isDeduped = await dependenciesDeduped();

    console.log("[ 1 / 3 ] 🔍  copying project...");
    console.log("[ 2 / 3 ] 🚚  fetching node_modules...");

    // await copyProjectFiles(projectName, template);
    // await updatePackageJson(projectName);

    console.log("[ 3 / 3 ] 🔗  linking node_modules...");
    console.log(
      "\u001b[2m──────────────────────────────────────────\u001b[22m",
    );

    spinner = ora();
    spinner.start();

    // await installNodeModules(projectName, spinner);
    // isUpdated && (await updateNodeModules(projectName, spinner));
    // isDeduped && (await dedupeNodeModules(projectName, spinner));
    // await postInstallScripts(projectName, template, spinner);

    // await createGitignore(projectName, spinner);
    // await initGit(projectName);

    await succeedConsole(template, spinner);
  } catch (error) {
    console.log(error);
    await failConsole(error, spinner);
  }
};
