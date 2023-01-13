import "dotenv/config";
import * as fs from "fs";
import { AppModule } from "src/app.module";
import { NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const configureDocumentation = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("Contract Management API")
    .setDescription("The data access backend for Contract Management application")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document);
  fs.writeFileSync("./contract-spec.json", JSON.stringify(document));
};

const port = process.env.PORT || 8989;

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  app.enableCors();
  configureDocumentation(app);

  await app.listen(port);
};

bootstrap();
