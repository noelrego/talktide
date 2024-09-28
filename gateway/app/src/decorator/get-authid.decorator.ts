import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetAuthIdFromToken = createParamDecorator(
    (data: undefined, cxt: ExecutionContext): string => {
        const request = cxt.switchToHttp().getRequest();
        return request.user['authId'];
    }
)