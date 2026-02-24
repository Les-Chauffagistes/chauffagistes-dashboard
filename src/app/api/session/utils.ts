import { getSession } from "../lib/session";

export default async function getCurrentUser() {
    return await getSession();
}
