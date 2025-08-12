import printTitle from "./helpers/printTitle.js"
import { PKG_ROOT } from "./constants.js";

import inquirer from "inquirer";

import fs from "fs";
import path from "path";
import { exec } from "node:child_process";


export async function main() {
    printTitle();

    const name = (await inquirer.prompt({
        type: "input",
        name: "name",
        message: "What is your project name?",
    })).name;
    
    const shouldInstallDeps = (await inquirer.prompt({
        type: "confirm",
        name: "installDeps",
        message: "Run npm install?"
    })).installDeps;

    const projPath = path.join(process.cwd(), name);

    if (fs.existsSync(projPath)) {
        console.error("Could not create project directory. Project directory is not empty.");
        console.log("Aborting...")
        return;
    }

    fs.mkdirSync(projPath);
    fs.cpSync(path.join(PKG_ROOT, "template/base/"), projPath, {recursive: true});
    fs.renameSync(
        path.join(projPath, "_.gitignore"),
        path.join(projPath, ".gitignore")
    );

    if(shouldInstallDeps)
        exec("npm install", {cwd: projPath})
}