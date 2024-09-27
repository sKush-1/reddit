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
        // Create the post, createdAt and updatedAt will be automatically set by default
        // const post = em.create(Post, title: "hello") as RequiredEntityData<Post>;
        const post = em.create(Post, {
            title: title,
          } as RequiredEntityData<Post>);
        await em.persistAndFlush(post);
        return post;
        
    }
    
   

}