import { Migration } from '@mikro-orm/migrations';

export class Migration20241003172843 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "post" add column "text" text not null, add column "points" int not null default 0, add column "creator_id" int not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "post" drop column "text", drop column "points", drop column "creator_id";`);
  }

}
