import type { UserLoginEvent, UserModifiedEvent, UserSignupEvent, UserValidateEvent } from '@netlify/functions';
import { isAllowedEmail } from '../lib/account.ts';

async function restrictAccount(event: UserValidateEvent | UserSignupEvent | UserLoginEvent | UserModifiedEvent) {
    if (!await isAllowedEmail(event.user.email) || (event.user.pendingEmail && !await isAllowedEmail(event.user.pendingEmail))) return event.deny();
}

export default {
    userValidate: restrictAccount,
    userSignup: restrictAccount,
    userLogin: restrictAccount,
    userModified: restrictAccount,
};
