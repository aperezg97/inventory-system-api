
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponseModel } from '../dtos';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();

        return next
            .handle()
            .pipe(
                map((responseBody) => {
                    if (responseBody instanceof HttpResponseModel) {
                        const mappedResponse = responseBody as HttpResponseModel<Object>;
                        const ctxResponse = ctx.getResponse<Response>();
                        ctxResponse.status(mappedResponse.statusCode);
                        // ctxResponse.status(HttpStatus.NOT_FOUND).json(ResponseDataHere);
                        // throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                        return responseBody;
                    }
                    return responseBody;
                }),
            );
    }
}
