import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from "src/config";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor (
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getJwtSecret(),
            ignoreExpiration: false
        })
    }

    async validate(data: any) {
        return data;
    }
}