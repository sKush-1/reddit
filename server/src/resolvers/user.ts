import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import {z} from "zod"
import { MyContext } from "../types";
import { User } from "../entities/User";
import { RequiredEntityData } from "@mikro-orm/core";
import argon2 from "argon2";



const userSchema = z.object({
  username: z.string().max(30).min(3),
  password: z.string().max(30).min(4),
})

@InputType()
class UserInput {
  @Field(() => String)
  username: string;
  @Field(() => String)
  password: string;
}

@ObjectType()
class FieldError {
  @Field(() => String)
  field: string;
  @Field(() => String)
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options", () => UserInput) options: UserInput,
    @Ctx() { em }: MyContext
  ) {
    try {
      userSchema.parse(options);
      const hashedPassword = await argon2.hash(options.password);
      const user = em.create(User, {
        username: options.username,
        password: hashedPassword,
      } as RequiredEntityData<User>);
      await em.persistAndFlush(user);
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UserInput) options: UserInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {

    try {
      userSchema.parse(options);
      
      const user = await em.findOne(User, { username: options.username });
  
      if (!user) {
        return {
          errors: [
            {
              field: "username",
              message: "Invalid user details",
            },
          ],
        };
      }
  
      const valid = await argon2.verify(user.password, options.password);
  
      if (!valid) {
        return {
          errors: [
            {
              field: "username",
              message: "Invalid user details",
            },
          ],
        };
      }
  
  
      return {
        user
      };
    } catch (error) {
      console.log(error);
      return {
        errors: [
          {
            field: "Failed to login",
            message: "Invalid user details",
          },
        ],
      };
    }
  }

  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }
}
