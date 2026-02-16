import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService {
  printInfo(data: any) {
    console.log(data);
  }
}
