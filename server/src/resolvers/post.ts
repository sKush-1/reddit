import {Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql"
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { RequiredEntityData } from "@mikro-orm/core";
import { isAuth } from "../middleware/isAuth"

@Resolver()
export class PostResolver {

    @Query(() => [Post], { nullable: true })
async post(
    @Arg('limit', () => Number) limit: number,
    @Arg("startDate", () => String, { nullable: true }) startDate: string | undefined,
    @Ctx() { em }: MyContext
): Promise<Post[]> {
    const realLimit = Math.min(50, limit);
    const qb = em.createQueryBuilder(Post, "p")
        .orderBy({ createdAt: 'desc' }) // Assuming you want to order by createdAt ASC
        .limit(realLimit);

        if (startDate) {
            const formattedDate = new Date(startDate).toISOString().slice(0, 10);
            qb.where({
                createdAt: { $gte: formattedDate } 
            });
        }

    return await qb.getResultList();
}


    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("title", () => String) title: string,
        @Arg("text", () => String) text: string,
        @Ctx() { em ,req}: MyContext
    ): Promise<Post>  {
        
        const userID = Number(req.session.userId);

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