import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetAuthInfoFromToken = createParamDecorator(
    (data: any, cxt: ExecutionContext): string => {
        const request = cxt.switchToHttp().getRequest();

        if (!data) return request.user;

        return request.user[data];
    }
)