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
import { z, ZodError } from "zod";
import { MyContext } from "../types";
import { User } from "../entities/User";
import { RequiredEntityData } from "@mikro-orm/core";
import argon2 from "argon2";
import { COOKIENAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { sendEmail } from "../../utils/sendEmail";
import { v4 } from "uuid";

// Base Zod schema for shared fields
const userBaseSchema = z.object({
  username: z.string().max(30).min(3),
  password: z.string().max(30).min(4),
});

// Extend base schema to include the email field for registration
const userRegistrationSchema = userBaseSchema.extend({
  email: z.string().email(),
});

// Common input for username and password
@InputType()
class UserBaseInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}

// Extend common input for registration (adds email)
@InputType()
class UserRegistrationInput extends UserBaseInput {
  @Field(() => String)
  email: string;
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
  @Query(() => User, { nullable: true })
  me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    const UserID = Number(req.session.userId);

    return em.findOne(User, { id: UserID });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UserRegistrationInput) options: UserRegistrationInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      userRegistrationSchema.parse(options);

      const existingUser = await em.findOne(User, {
        $or: [{ email: options.email }, { username: options.username }],
      });

      if (existingUser) {
        return {
          errors: [
            {
              field:
                existingUser.email === options.email ? "email" : "username",
              message:
                existingUser.email === options.email
                  ? "Email already exists"
                  : "Username already exists",
            },
          ],
        };
      }

      const hashedPassword = await argon2.hash(options.password);
      const user = em.create(User, {
        username: options.username,
        password: hashedPassword,
        email: options.email,
      } as RequiredEntityData<User>);

      await em.persistAndFlush(user);
      req.session.userId = `${user.id}`;
      return { user };
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        return {
          errors: error.errors.map((e) => ({
            field: e.path[0].toString(),
            message: e.message,
          })),
        };
      }

      console.log(error);
      return {
        errors: [
          {
            field: "email",
            message: "Something went wrong",
          },
        ],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UserBaseInput) options: UserBaseInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    try {
      userBaseSchema.parse(options);

      const user = await em.findOne(User, {
        $or: [{ email: options.username }, { username: options.username }],
      });
      
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
              field: "password",
              message: "Invalid user details",
            },
          ],
        };
      }

      req.session.userId = `${user.id}`;
      return { user };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          errors: error.errors.map((e) => ({
            field: e.path[0].toString(),
            message: e.message,
          })),
        };
      }

      console.log(error);
      return {
        errors: [
          {
            field: "unknown",
            message: "Something went wrong",
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email", () => String) email: string , 
     @Ctx() {em,redisClient} : MyContext
  ) {

    const forgotPasswordSchema = z.object({
      email: z.string().min(3).max(30)
    })
    forgotPasswordSchema.parse({email});
    

    const user = await em.findOne(User, {
      $or: [{email:email}, {username:email}],
    });
    if(!user) {
      return true;
    }

    const token = v4();
    
     
     await sendEmail(user.email,"Forgot password",`<a href="${process.env.FRONTEND_URL}/change-password/${token}`);
     
     
     const key = FORGOT_PASSWORD_PREFIX+token;
     redisClient.set(key, user.id);
     redisClient.expire(key,1 * 24 * 24 * 60);
      

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword (
    @Arg("token", () => String) token: string , 
    @Arg("newPassword", () => String) newPassword: string ,
    @Ctx() {em,req,redisClient} : MyContext

  ){
    try {
      const changePasswordSchema = z.object({
        token: z.string().length(36),
        newPassword: z.string().min(4).max(36)
      })
  
      changePasswordSchema.parse({token,newPassword});
      
  
      const userId = await redisClient.GET(FORGOT_PASSWORD_PREFIX+token);
      if(!userId){
        return {
          errors: [
            {
              field: "newPassword",
              message: "token expired"
            }
          ]
        }
      }
      const user = await em.findOne(User,{id:parseInt(userId)});
  
      if(!user){
        return {
          errors: [
            {
              field: "newPassword",
              message: "User no longer exists"
            }
          ]
        }
      }
  
      const hashedPassword = await argon2.hash(newPassword);
  
      req.session.userId = `${user.id}`;
  
  
      user.password = hashedPassword;
      em.persistAndFlush(user);
      redisClient.DEL(FORGOT_PASSWORD_PREFIX+token)
      return {user};
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          errors: error.errors.map((e) => ({
            field: e.path[0].toString(),
            message: e.message,
          })),
        };
      }
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIENAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
