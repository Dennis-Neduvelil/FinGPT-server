import { Injectable } from '@nestjs/common';

/**
 * A builder class to create consistent API responses.
 * 
 * Usage:
 * ```ts
 * const response = new ResponseBuilder<{ userId: string }>()
 *   .status(201)
 *   .message('User created successfully')
 *   .data({ userId: 'abc123' })
 *   .build();
 * ```
 * 
 * @template T The type of the `data` object
 */
@Injectable()
export class ResponseBuilder<T extends Record<string, any> = Record<string, any>> {
  private _status?: number;
  private _message?: string;
  private _data?: T;

  /**
   * Set the HTTP status code for the response.
   * @param status HTTP status code
   */
  status(status: number): this {
    this._status = status;
    return this;
  }

  /**
   * Set the message for the response.
   * @param message Response message
   */
  message(message: string): this {
    this._message = message;
    return this;
  }

  /**
   * Set the response data object.
   * @param data Response payload
   */
  data(data: T): this {
    this._data = data;
    return this;
  }

  /**
   * Build the response object.
   * @returns An object containing `statusCode`, `message`, and `data`
   */
  build(): { statusCode: number; message?: string; data?: T } {
    const response: { statusCode: number; message?: string; data?: T } = {
      statusCode: this._status ?? 200,
    };
    if (this._message) response.message = this._message;
    if (this._data) response.data = this._data;
    return response;
  }
}