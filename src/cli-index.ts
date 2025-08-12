import printTitle from "./helpers/printTitle.js"
import { PKG_ROOT } from "./constants.js";

import inquirer from "inquirer";

import fs from "fs";
import path from "path";
import { exec as _exec } from "node:child_process";
import ora from "ora";
import { promisify } from "node:util";

const exec = promisify(_exec);

export async function main() {
    printTitle();

    const name = (await inquirer.prompt({
        type: "input",
        name: "name",
        message: "What is your project name?",
        default: "my-staticwind-app"
    })).name;
    
    const shouldInstallDeps = (await inquirer.prompt({
        type: "confirm",
        name: "installDeps",
        message: "Run npm install?"
    })).installDeps;

    console.log();

    const projPath = path.join(process.cwd(), name);

    if (fs.existsSync(projPath)) {
        console.error("Project directory is not empty.");
        console.log("Aborting...")
        return;
    }

    let spinner = ora({text: "Copying template", color: "green"}).start();

    fs.mkdirSync(projPath);
    fs.cpSync(path.join(PKG_ROOT, "template/base/"), projPath, {recursive: true});
    fs.renameSync(
        path.join(projPath, "_.gitignore"),
        path.join(projPath, ".gitignore")
    );

    const packagePath = path.join(projPath, "package.json");
    const packageJson = fs.readFileSync(packagePath, { encoding: "utf-8" });
    fs.writeFileSync(
        packagePath,
        packageJson.replaceAll("my-staticwind-app", name),
        { encoding: "utf-8" });

    spinner.succeed();

    spinner = ora({text: "Installing dependencies", color: "green"}).start();

    if(shouldInstallDeps) {
        await exec("npm install", {cwd: projPath})
            .then(() => spinner.succeed())
            .catch(() => spinner.fail());
    }else {
        spinner.text += " - skipped";
        spinner.color = "gray";
        spinner.fail();
    }
}