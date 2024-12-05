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
                return null
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
            console.log("Error while logging :: login :: ", error)
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            if (user){
                console.log("User is logged in :: getCurrentUser :: ", user)
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async logout() {
        try {
            // await this.account.deleteSession('current')
            await this.account.deleteSessions(); // Logs Out from all browsers
            
        } catch (error) {  
            console.log("User session not removed :: logout :: ", error)
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService; // Passing object instead of a class, so that the user doesnt haave to create an object

