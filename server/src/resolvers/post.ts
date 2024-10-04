import {Arg, Ctx, Int, Mutation, Query, Resolver} from "type-graphql"
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { RequiredEntityData } from "@mikro-orm/core";
import { User } from "../entities/User";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(@Ctx() {em}: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, { nullable: true})
    post(
        @Arg("id", () => Int) id:number,
        @Ctx() {em}: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, {_id:id})
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title", () => String) title: string,
        @Arg("text", () => String) text: string,
        @Ctx() { em ,req}: MyContext
    ): Promise<Post | String>  {
        if(!req.session.userId){
            return "User not signed in";
        }
        const userID = Number(req.session.userId);
        const user = await em.findOne(User,{id:userID});        

        const post = em.create(Post, {
            title,
            text,
            creatorId:userID
          } as RequiredEntityData<Post>);

        await em.persistAndFlush(post);
        return post;
    }
    
    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg("id", () => Int) id:number,
        @Arg("title", () => String, {nullable: true}) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        
        const post = await em.findOne(Post, {_id:id});
          if(!post) {
            return null;
          }
          if(typeof title !== 'undefined'){
            post.title = title;
            await em.persistAndFlush(post)
          }

        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id", () => Int) id:number,
        @Ctx() { em }: MyContext
    ): Promise<Boolean> {
        await em.nativeDelete(Post, {_id:id});
        return true;
    }
    
   

}