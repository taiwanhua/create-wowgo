import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { readdir, copyFile } from "node:fs";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import copy from "copy-template-dir-variable-injection";
import { rimraf } from "rimraf";
import { defaultDestFolder } from "../bin/codegen.js";
// import ncp from "ncp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readDir = promisify(readdir);

/**
 * @method copyProjectFiles
 * @description Duplicate the template.
 * @param projectInfo - object with property projectName, projectPath, projectParentPath, turboVersion
 */
const copyProjectFiles = async (projectInfo) => {
  const { projectName, projectPath, projectParentPath, turboVersion } =
    projectInfo;

  return new Promise((resolve, reject) => {
    const spinner = ora();
    spinner.start("Start Copy Template ...");

    const vars = {
      project_name: projectName,
      // lib/turbo/1.11.3/{{project_name}}/apps/web/app/page.tsx:108
      [` pointerEvents: "none" `]: `{{ pointerEvents: "none" }}`,
      // lib/turbo/1.11.3/{{project_name}}/packages/ui/turbo/generators/config.ts:19
      "kebabCase name": "{{kebabCase name}}",
      // lib/turbo/1.11.3/{{project_name}}/packages/ui/turbo/generators/templates/component.hbs:1
      " pascalCase name ": "{{ pascalCase name }}",
    };
    const inDir = path.join(__dirname, `turbo/${turboVersion}`);
    const outDir = projectParentPath;

    copy(
      inDir,
      outDir,
      vars,
      "{{\\s*([^{}\\s]+)\\s*}}",
      (err, createdFiles) => {
        if (err) {
          throw err;
        }

        createdFiles.reduce((acc, destination) => {
          if (!destination.includes("favicon.ico")) {
            return acc;
          }

          const sourcePath = destination.replace(
            new RegExp(`${projectName}(?!.*${projectName})`),
            "{{project_name}}",
          );

          // copy favicon.ico file
          const source = `${inDir}/{{project_name}}/${
            sourcePath.split("{{project_name}}")[1]
          }`;

          copyFile(source, destination, (err) => {
            if (err) {
              throw err;
            }
          });
        }, []);

        resolve("done!");
      },
    );

    spinner.succeed(chalk.green(`Complete Copy Template.`));
  });
};

/**
 * @method removeUnusedTemplates
 * @description Remove Unused Templates.
 * @param projectInfo - object with property projectName, projectPath, projectParentPath, turboVersion
 */
const removeUnusedTemplates = async (projectInfo, unusedTemplates) => {
  const { projectName, projectParentPath } = projectInfo;

  return new Promise((resolve, reject) => {
    const spinner = ora();
    spinner.start("Start Setup Choose Template ...");

    const outDir = projectParentPath;

    unusedTemplates.forEach((template) => {
      rimraf(`${outDir}/${projectName}/apps/${template}`);
    });

    spinner.succeed(chalk.green(`Complete Setup Choose Templates.`));

    resolve("done!");
  });
};

/**
 * @method getDirectories
 * @description Get the templates directory.
 * @param projectInfo - object with property projectName, projectPath, projectParentPath, turboVersion
 */
const getTemplateDir = async (projectInfo) => {
  const { turboVersion } = projectInfo;

  const contents = await readDir(
    `${__dirname}/turbo/${turboVersion}/{{project_name}}/apps`,
    {
      withFileTypes: true,
    },
  );
  const directories = contents
    .filter((p) => p.isDirectory())
    .map((p) => p.name);

  return directories;
};

/**
 * @method toChooseTemplates
 * @description Choose templates.
 * @param projectInfo - object with property projectName, projectPath, projectParentPath, turboVersion
 */
const toChooseTemplates = async (projectInfo) => {
  const directories = await getTemplateDir(projectInfo);

  const { chooseTemplates } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "chooseTemplates",
      message: "Please select the templates you need : ",
      choices: [
        new inquirer.Separator(" ====== The Templates ====== "),
        ...directories,
        new inquirer.Separator(" ======  ====== "),
      ],
      validate: function (answer) {
        if (answer.length < 1) {
          return "You must choose at least one topping.";
        }
        return true;
      },
    },
  ]);

  const unusedTemplates = directories.filter(
    (template) => !chooseTemplates.includes(template),
  );

  return { chooseTemplates, unusedTemplates };
};

/**
 * @method toSetProjectName
 * @description To Set Project Name.
 * @param projectInfo - object with property projectName, projectPath, projectParentPath, turboVersion
 */
const toSetProjectName = async (projectInfo) => {
  if (projectInfo.projectName === defaultDestFolder) {
    const { setProjectName } = await inquirer.prompt([
      {
        type: "input",
        name: "setProjectName",
        message: `Please set the project name (default is ${defaultDestFolder}): `,
      },
    ]);

    return {
      setProjectName: setProjectName ? setProjectName : projectInfo.projectName,
    };
  } else {
    return { setProjectName: projectInfo.projectName };
  }
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
    }[template[0]] ?? "";

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
 * @param projectInfo - object with property projectName, projectPath, projectParentPath, turboVersion
 */
export const createProject = async (projectInfo) => {
  let spinner;

  const { projectPath, turboVersion } = projectInfo;

  try {
    const { setProjectName } = await toSetProjectName(projectInfo);
    projectInfo.projectName = setProjectName;

    const { chooseTemplates, unusedTemplates } =
      await toChooseTemplates(projectInfo);

    spinner = ora();
    spinner.start();

    if (chooseTemplates.length === 0) {
      spinner.warn("You don't select any project template");
    }

    console.log(`[ 1 / 5 ] 🫳  select project template: ${chooseTemplates}`);
    console.log(
      `[ 2 / 5 ] 👓  config turboVersion: ${turboVersion}, outDir: ${projectPath}`,
    );
    console.log("[ 3 / 5 ] 🔍  copying project...");

    await copyProjectFiles(projectInfo);
    await removeUnusedTemplates(projectInfo, unusedTemplates);

    console.log("[ 4 / 5 ] 🚚  fetching node_modules...");
    console.log("[ 5 / 5 ] 🔗  linking node_modules...");
    console.log(
      "\u001b[2m──────────────────────────────────────────\u001b[22m",
    );

    await succeedConsole(chooseTemplates, spinner);
  } catch (error) {
    console.log(error);
    await failConsole(error, spinner);
  }
};
