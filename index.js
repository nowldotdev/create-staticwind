#!/usr/bin/env node
import printTitle from "./lib/title.js"
import inquirer from "inquirer";

import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";


async function main() {
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
    fs.cpSync("./template/base/", projPath, {recursive: true});
    fs.renameSync(
        path.join(projPath, "_.gitignore"),
        path.join(projPath, ".gitignore")
    );

    if(shouldInstallDeps)
        exec("npm install", {cwd: projPath})
}


main().catch((err) => console.error("Error:", err));