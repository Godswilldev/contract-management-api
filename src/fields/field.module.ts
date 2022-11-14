import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Field } from "src/fields/models/field.entity";
import { FieldService } from "src/fields/field.service";
import { FieldController } from "src/fields/field.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Field])],
  providers: [FieldService],
  controllers: [FieldController],
})
export class FieldModule {}
