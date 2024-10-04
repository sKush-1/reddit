import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryKey()
  _id!: number;

  @Field(() => String ,)
  @Property({type: 'text'})
  title!: string;

  @Field(() => String ,)
  @Property({type: 'text'})
  text!: string;

  @Field(() => Int)
  @Property({type: "int", default: 0})
  points!: number;

  @Field(() => Int)
  @Property({type: "int"})
  creatorId!: number;

  // @ManyToOne(() => User) 
  // creator: User

  @Field(() => String)
  @Property({type: 'date'})
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();


}
