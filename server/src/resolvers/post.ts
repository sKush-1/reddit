import {Arg, Ctx, Int, Mutation, Query, Resolver} from "type-graphql"
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { RequiredEntityData } from "@mikro-orm/core";

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
        @Ctx() { em }: MyContext
    ): Promise<Post> {
        const post = em.create(Post, {
            title: title,
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
        const post = await
         em.findOne(Post, {
            _id: id,
          } as RequiredEntityData<Post>);
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