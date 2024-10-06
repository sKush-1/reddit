import {  EntityManager } from "@mikro-orm/postgresql"
import { AbstractSqlConnection, AbstractSqlDriver, AbstractSqlPlatform } from "@mikro-orm/postgresql";
import { Request, Response,} from "express";
import { RedisClientType } from "redis";


// 
declare module 'express-session' {
    interface SessionData {
      userId?: string; 
    }
  }

export type MyContext =  {
    em: EntityManager<AbstractSqlDriver<AbstractSqlConnection, AbstractSqlPlatform>>;
    req: Request & {session: Express.SessionStore} ;
    res: Response;
    redisClient: RedisClientType
}