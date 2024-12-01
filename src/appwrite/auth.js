import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        this.account = new Account(this.client)
    }

    async createAccount({email, password, name}){
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);

            if (userAccount) {
                // Call another method that logs in the use directly
                return this.login({email, password});
            } else {
                return 
            }
        } catch (error) {
            throw error;
        }
    }

    async login({email, password}){
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            throw error;
        }

        return null;
    }

    async logout() {
        try {
            // await this.account.deleteSession('current')
            await this.account.deleteSessions(); // Logs Out from all browsers
            
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService; // Passing object instead of a class, so that the user doesnt haave to create an object

