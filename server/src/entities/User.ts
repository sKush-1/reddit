import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;


  @Field(() => String ,)
  @Property({type: 'text', unique: true,})
  email!: string;


  @Field(() => String ,)
  @Property({type: 'text', unique: true})
  username!: string;

  
  @Property({type: 'text'})
  password!: string;

  // @OneToMany(() => Post, post => post.creator)
  // posts = new Collection<[Post]>(this)

  @Field(() => String)
  @Property({type: 'date'})
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();


}
