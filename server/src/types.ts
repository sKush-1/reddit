import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { Request, Response,} from "express";
import { RedisClientType } from "redis";


// 
declare module 'express-session' {
    interface SessionData {
      userId?: string; 
    }
  }

export type MyContext =  {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request & {session: Express.SessionStore} ;
    res: Response;
    redisClient: RedisClientType
}