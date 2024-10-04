import { ENVS } from "../config/environment";

const BASEURL = ENVS.GATEWAY_URL;

export const API_ENDPOINT = {
    LOGIN : `${BASEURL}/user/login`,
    REGISTER: `${BASEURL}/user/register`,
    CHECK_USER: `${BASEURL}/user/check-username`,
    GET_ALL_USERS : `${BASEURL}/user`,
    GET_AVAILABLEUSER_LIST : `${BASEURL}/user/available-list`,
}