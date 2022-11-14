import "dotenv/config";
import * as fs from "fs";
import { AppModule } from "src/app.module";
import { INestApplication, Logger } from "@nestjs/common";
import { NestApplication, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");

  const logger = new Logger(NestApplication.name);

  configureCors(logger, app);

  // if (process.env.NODE_ENV === "development") {
  configureDocumentation(logger, app);
  // }

  await app.listen(process.env.PORT || 3000, () => {
    logger.log(`Application is running on: ${process.env.PORT || 3000}`);
  });
}

const configureCors = (logger: Logger, app: INestApplication) => {
  logger.log("Enabling cors policy");
  app.enableCors();
};

const configureDocumentation = (logger: Logger, app: INestApplication) => {
  logger.log("setting up swagger documentation");

  const config = new DocumentBuilder()
    .setTitle("Contract-Management API")
    .setDescription("The data access backend for Contract Management application")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document);
  fs.writeFileSync("./contract-spec.json", JSON.stringify(document));
};

bootstrap();
