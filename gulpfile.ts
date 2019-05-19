/* eslint-disable no-console */
import chalk from "chalk";
import gulp from "gulp";
import * as _ from "lodash";
import * as shell from "shelljs";
import rmrf from "rimraf";
import fse from "fs-extra";
import {
    PUBLISH,
    PUBLISH_MINOR,
    PUBLISH_MAJOR,
    PUBLISH_DONE,
    BUMP_START,
    BUMP_END,
    BUMP_PATCH,
    BUMP_MINOR,
    BUMP_MAJOR,
} from "./gulpTasks.json";
import pkg from "./package.json";

shell.config.silent = true;
shell.config.verbose = false;

const showVariables = () => {
    const shown = ["NODE_ENV"];
    console.log(chalk.magenta(`process.env variables: `) + chalk.cyan(`{`));
    _.mapValues(process.env, (value, key) => {
        if (_.includes(shown, key)) {
            console.log(
                chalk.blue(`    ${key}: `) + chalk.gray(value || "undefined")
            );
        }
    });
    console.log(chalk.cyan(`}`));
};

gulp.task("init", (done) => {
    done();
});

gulp.task(
    "init:dev",
    gulp.series("init", (done) => {
        process.env.NODE_ENV = "development";
        showVariables();
        done();
    })
);

gulp.task(
    "init:prod",
    gulp.series("init", (done) => {
        process.env.NODE_ENV = "production";
        showVariables();
        done();
    })
);

const [major, minor, patch] = pkg.version.split(".");
let newVersion: string;

gulp.task(
    BUMP_START.task,
    gulp.series((done) => {
        console.log(chalk.blue("Bumping version..."));
        done();
    })
);
gulp.task(
    BUMP_END.task,
    gulp.series((done) => {
        const newPkg = Object.assign({}, pkg, { version: newVersion }); // update version
        fse.writeFileSync("./package.json", JSON.stringify(newPkg, null, 4));

        console.log(
            chalk.green("Package Version Updated"),
            chalk.bold.white(pkg.version),
            chalk.green("->"),
            chalk.bold.white(newVersion)
        );
        done();
    })
);

gulp.task(
    BUMP_PATCH.task,
    gulp.series(
        BUMP_START.task,
        (done) => {
            newVersion = `${major}.${minor}.${parseInt(patch, 10) + 1}`;
            done();
        },
        BUMP_END.task
    )
);

gulp.task(
    BUMP_MINOR.task,
    gulp.series(
        BUMP_START.task,
        (done) => {
            newVersion = `${major}.${parseInt(minor, 10) + 1}.${0}`;
            done();
        },
        BUMP_END.task
    )
);

gulp.task(
    BUMP_MAJOR.task,
    gulp.series(
        BUMP_START.task,
        (done) => {
            newVersion = `${parseInt(major, 10) + 1}.${0}.${0}`;
            done();
        },
        BUMP_END.task
    )
);

gulp.task(
    PUBLISH_DONE.task,
    gulp.series((done) => {
        console.log(
            chalk.green("✔ succesfully published tchin-backend"),
            chalk.white("( https://www.npmjs.com/package/tchin-backend )")
        );
        rmrf.sync("./dist");
        done();
    })
);
gulp.task(
    PUBLISH.task,
    gulp.series(
        BUMP_PATCH.task,
        (done) => {
            shell.exec("npm publish");
            done();
        },
        PUBLISH_DONE.task
    )
);
gulp.task(
    PUBLISH_MINOR.task,
    gulp.series(
        BUMP_MINOR.task,
        (done) => {
            shell.exec("npm publish");
            done();
        },
        PUBLISH_DONE.task
    )
);
gulp.task(
    PUBLISH_MAJOR.task,
    gulp.series(
        BUMP_MAJOR.task,
        (done) => {
            shell.exec("npm publish");
            done();
        },
        PUBLISH_DONE.task
    )
);
