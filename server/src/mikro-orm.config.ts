import path from "path";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import 'reflect-metadata';
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import dotenv from "dotenv";
import { User } from "./entities/User";

dotenv.config();


export default {
    migrations: {
        path: path.join(__dirname+'/migrations'),
        glob: '!(*.d).{js,ts}',
    },
    entities: [Post,User],
    dbName: "reddit",
    debug: !__prod__,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    allowGlobalContext: true,
    driver: PostgreSqlDriver,
    metadataCache: { enabled: false},
    metadataProvider: TsMorphMetadataProvider,
    
} as Parameters<typeof MikroORM.init>[0];