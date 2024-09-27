import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes } from "crypto";
import { AuthTokenPayloadType } from "src/common";
import { CustomConfigService } from "src/config";

@Injectable()
export class HelperClass {
    constructor(
        private jwtService: JwtService,
        private configService: CustomConfigService,
    ) {}

    /**
     * 
     * @param data Helper funtion to Hash the data
     * @returns hashed data
     */
    hasData(data: string) : string {
        const salt =  randomBytes(8).toString('hex');
        const hash = createHash('sha256'); // ALgo
        const hasedPassword = hash.update(salt + data).digest('hex');
        return `${salt}::${hasedPassword}`;
    }

    /**
     * Function to verify the hash stored in the system
     * @param data 
     * @param hashedData 
     * @returns boolen
     */
    verifyHash(data: string, hashedData: string) : boolean {
        const [salt, storedHash] = hashedData.split('::');
        const hash = createHash('sha256');
        const inputHash = hash.update(salt + data).digest('hex');
        return inputHash === storedHash;
    }


    /**
     * Function to sign JWT token using shared secret
     * @param payload 
     * @returns jwt token string
     */
    async generateAuthToken(payload: AuthTokenPayloadType) : Promise<string> {
        const jwtToken : string = await this.jwtService.signAsync(
            {
            authId: payload.id,
            userName: payload.userName
            },
            {
                secret: this.configService.getJwtSecret(),
                expiresIn: '2h'
            }
        );

        return jwtToken;
    }
}