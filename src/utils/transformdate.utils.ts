import { HttpException, HttpStatus } from "@nestjs/common";
import { ResponseManager } from "./responseManager";
import { DateTime } from "luxon";

const isNumeric = (value: number) => !isNaN(value);
export const validateDate = (dateArray: string[]) => {
  if (dateArray.length !== 3) {
    throw new HttpException(
      ResponseManager.BadRequestResponse(`query parameter date is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  dateArray.forEach((el, index) => {
    if (!isNumeric(Number(el))) {
      throw new HttpException(
        ResponseManager.BadRequestResponse(`query parameter date is invalid`, null),
        HttpStatus.BAD_REQUEST,
      );
    }
    if (index > 0) {
      if (el.length !== 2) {
        throw new HttpException(
          ResponseManager.BadRequestResponse(`query parameter date is invalid`, null),
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  });
};

export const transformToValidDate = (value: string) => {
  //ensure value is not empty
  if (!value || value.length === 0) {
    throw new HttpException(
      ResponseManager.BadRequestResponse(`query parameter date is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //check that value is NOT an object
  if (typeof value === "object") {
    throw new HttpException(
      ResponseManager.BadRequestResponse(`query parameter date is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //check that value is not just a plain number
  if (isNumeric(Number(value))) {
    throw new HttpException(
      ResponseManager.BadRequestResponse(`query parameter date is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  const dateArray = value.split(",");

  //check that value was split correctly
  if (!dateArray[1]) {
    throw new HttpException(
      ResponseManager.BadRequestResponse(`query parameter date is invalid`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  //validate dates
  const fromDate = dateArray[0].split("-");
  validateDate(fromDate);

  const toDate = dateArray[1].split("-");
  validateDate(toDate);

  const veryEndOfDay = dateArray[1].concat("T23:59:59.999");

  //convert to ISO string
  return [DateTime.fromISO(dateArray[0]).toISO(), DateTime.fromISO(veryEndOfDay).toISO()];
};
