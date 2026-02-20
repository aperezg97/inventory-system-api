
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpResponseModel } from '../dtos';
import { Response } from 'express';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    return next
      .handle()
      .pipe(
        catchError(err => throwError(() => {
            // log exceptions here, maybe send email notifications ?
            console.error('ErrorInterceptor', err);
            let response = null;
            if (err instanceof BadRequestException) {
                response = HttpResponseModel.badRequestResponse((err as BadRequestException).message);
            } else if (err instanceof UnauthorizedException) {
              response =  HttpResponseModel.unauthorizedErrorResponse((err as UnauthorizedException).message);
            } else {
              response =  HttpResponseModel.internalServerErrorResponse();
            }
            const ctxResponse = ctx.getResponse<Response>();
            ctxResponse.status(response.statusCode).json(response);
            return err;
        })),
      );
  }
}
