CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(150),
	"address" varchar(250),
	"phone_number" varchar(15),
	"profile_image_url" varchar(250),
	"branch_office_id" uuid,
	"company_id" uuid,
	"user_id" uuid,
	"is_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "employees_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"is_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "roles_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(256) NOT NULL,
	"email" varchar(150),
	"role_id" uuid,
	"company_id" uuid,
	"is_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "users_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "employees_email_company" ON "employees" USING btree ("company_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_company" ON "users" USING btree ("company_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_company" ON "users" USING btree ("company_id","username");