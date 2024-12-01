import conf from "../conf/conf";
import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

// Here we will be creating image additon and adding ID to database

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor() {
        // Create new client
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        // Create databases
        this.databases = new Databases(this.client)
        // Create bucket
        this.bucket = new Storage(this.client)
        
    }

    async createPost({title, content, slug, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId, // database id
                conf.appwriteCollectionId, // collection id
                slug, // Document ID
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                } // Send Data Here
            )
        } catch (error) {
            console.log("Appwrite Service :: CreatePost :: Error :: ", error);
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId, // database id
                conf.appwriteCollectionId, // collection id
                slug, // Document ID
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            console.log("Appwrite Service :: UpdatePost :: Error :: ", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log("Appwrite Service :: DeletePost :: Error :: ", error);
            return false;
        }
    }

    async getPost(slug){
        try {
            return this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite Service :: GetPost :: Error :: ", error);
            return false;
        }
    }

    // Get all posts, using a query
    // You need indexes to make a query
    // Queries are passed as Arrays
    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                queries
            )
        } catch (error) { 
            console.log("Appwrite Service :: GetPosts :: Error :: ", error);
            return false;
        }
    }

    // File Upload Service
    // blog is uploaded
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite Service :: uploadFile :: Error :: ", error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
        } catch (error) {
            console.log("Appwrite Service :: deleteFile :: Error :: ", error);
            return false;
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}

const service = new Service();

export default service;