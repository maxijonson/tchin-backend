import { Express, Router } from "express";
import * as _ from "lodash";

interface ISubroute {
    path: string;
    router: Router;
}

export const preserveKeysCreator = <O>() => <T extends { [key: string]: O }>(
    arg: T
) => arg;

export const applySubroutes = (
    router: Express | Router,
    subRoutes: ISubroute[]
) => {
    _.forEach(subRoutes, ({ path, router: subrouter }) =>
        router.use(path, subrouter)
    );
};
