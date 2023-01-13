import "dotenv/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FieldModule } from "src/fields/field.module";
import { Field } from "src/fields/models/field.entity";
import { ClauseModule } from "src/clause/clause.module";
import { Clause } from "src/clause/models/clause.entity";
import { CommentModule } from "src/comment/comment.module";
import { Comment } from "src/comment/models/comment.entity";
import { ContractModule } from "src/contract/contract.module";
import { AddendumModule } from "src/addendum/addendum.module";
import { Contract } from "src/contract/models/contract.entity";
import { Addendum } from "src/addendum/models/addendum.entity";
import { DashboardModule } from "src/dashboard/dashboard.module";
import { ComponentModule } from "src/component/component.module";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { Component } from "src/component/models/component.entity";
import { RouteLogger } from "src/middlewares/routelogger.middleware";
import { ClauseTemplates } from "src/clause/models/clauseFiles.entity";
import { ContractTypeModule } from "src/contractType/contractType.module";
import { ContractType } from "src/contractType/models/contractType.entity";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AdditionalFields } from "src/additional-fields/model/additional-fields.entity";
import { AdditionalFieldsModule } from "src/additional-fields/additional-fields.module";
import { BusinessPartnersModule } from "src/business-partners/business-partners.module";
import { BusinessPartner } from "src/business-partners/entities/business-partner.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      // set to false when in production
      synchronize: true,
      logging: false,
      entities: [
        Field,
        Clause,
        Comment,
        Contract,
        Addendum,
        Component,
        ContractType,
        AdditionalFields,
        ClauseTemplates,
        BusinessPartner,
      ],
    }),
    FieldModule,
    ClauseModule,
    CommentModule,
    AddendumModule,
    ContractModule,
    DashboardModule,
    ComponentModule,
    ContractTypeModule,
    AdditionalFieldsModule,
    BusinessPartnersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RouteLogger).forRoutes("*").apply(AuthMiddleware).forRoutes(
      {
        path: "fields*",
        method: RequestMethod.ALL,
      },
      {
        path: "clause*",
        method: RequestMethod.ALL,
      },
      {
        path: "comment*",
        method: RequestMethod.ALL,
      },
      {
        path: "addendum*",
        method: RequestMethod.ALL,
      },
      {
        path: "contract*",
        method: RequestMethod.ALL,
      },
      {
        path: "dashboard*",
        method: RequestMethod.ALL,
      },
      {
        path: "component*",
        method: RequestMethod.ALL,
      },
      {
        path: "contractType*",
        method: RequestMethod.ALL,
      },
      {
        path: "additional-fields*",
        method: RequestMethod.ALL,
      },
      {
        path: "business-partners*",
        method: RequestMethod.ALL,
      },
    );
  }
}
