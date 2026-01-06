import { HttpStatus } from "@nestjs/common";

export class HttpResponseModel<T> {
    statusCode: number;
    data: T;
    errorMessage: string;
    successMessage: string;

    constructor(_statusCode = 200, _data: T | null = null, _errorMsg: string | null = null) {
        this.statusCode = _statusCode;
        if (_data) {
            this.data = _data;
        }
        if (_errorMsg) {
            this.errorMessage = _errorMsg;
        }
    }

    static okResponse<U>(_data: U): HttpResponseModel<U> {
        return new HttpResponseModel<U>(HttpStatus.OK, _data);
    }

    static notFoundResponse<U>(_errorMsg: string | null = null): HttpResponseModel<U> {
        return new HttpResponseModel<U>(HttpStatus.NOT_FOUND, null, _errorMsg);
    }

    static badRequestResponse<U>(_errorMsg: string | null = null): HttpResponseModel<U> {
        return new HttpResponseModel<U>(HttpStatus.BAD_REQUEST, null, _errorMsg);
    }

    static internalServerErrorResponse<U>(_errorMsg: string = 'Internal Server Error'): HttpResponseModel<U> {
        return new HttpResponseModel<U>(HttpStatus.INTERNAL_SERVER_ERROR, null, _errorMsg);
    }

    static unauthorizedErrorResponse<U>(_errorMsg: string): HttpResponseModel<U> {
        return new HttpResponseModel<U>(HttpStatus.UNAUTHORIZED, null, _errorMsg);
    }
}