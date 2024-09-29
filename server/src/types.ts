import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import { Request, Response, Express } from "express";

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
}