import React, {useCallback, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import {Button, Input, Select, RTE} from '../index'
import service from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({post}) {
    // watch - used to watch a filed continously
    // setValue - to set form values
    // control - gives control of the element, which we will pass in RTE as well
    // get Values - gets all the values from the form

    // This form can be used for adding and editing as well.

    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: { // If we have a post, then get the default values -> used druign editing.
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    });

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData)

    const slugTransform = useCallback((value) => {
        // This function is being used to update the slug value field in the form
        if (value && typeof(value) === 'string'){
            return value.trim().toLowerCase().replace(/^[a-zA-Z\d\s]+/g, '-').replace(/\s/g, '-')
        } else {
            return '';
        }
    }, [])

    const submit = async (data) => {
        // Get's the data from the form and does the following - 
        if (post) {
            // If we have post, we must be updating

            // Updating the Image First - Always
            const file = data.image[0] ? service.uploadFile(data.image[0]) : null

            // Deleting the old image
            if (file) {
                service.deleteFile(post.featuredImage)
            }

            const dbPost = await service.updatePost(post.$id, {
                // changes in the data object will be included in the update because of the spread operator (...data) 
                ...data,
                featuredImage: file ? file.$id : undefined
            })

            if (dbPost) {
                // After submission, navigate the user to the correct page
                navigate(`/post/${dbPost.$id}`)
            }

        } else {
            // In this case, we will be adding the post
            // First, we will be uploading a file
            const file = data.image[0] ? await service.uploadFile(data.image[0]) : undefined

            if (file) {
                // Adding the new post
                const fileId = file.$id // The $id property of the file object is extracted and assigned to fileId.
                data.featuredImage = fileId
                const dbPost = await service.createPost({
                    ...data,
                    usedId: userData.$id,
                })

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }

        useEffect(() => {
            // React cleans up the subscription when the component unmounts or the dependencies change.
            // Why?: To prevent memory leaks or multiple subscriptions being created over time.
        
          const subscription = watch((value, {name}) => {
            // In name, we will be giving the name of the field we will be watching
            if (name === 'title'){
                setValue('slug', slugTransform(value.title), {shouldValidate: true})
            }
          })        

          return () => {
            subscription.unsubscribe()
          }
        }, [watch, slugTransform, setValue])
        
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap"> 
        {/* Passing the submit function to handleSubmit */}
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                    
                    /// Registered as title, and it is a requried field
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    

                    // Registered as slug, requried field
                    // setValue is given by React-Hook-Form, here slug is the registered name, and we are changing it's values.
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                {/* Since, we needed control in RTE, we had to pass the control as well as the defaultValue - it will get all the values from the content */}
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                    // Registered as image, requried as per the existence of post. If post is being uploaded for the first time, we will make it requried. Otherwise, not.
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>

                    // If post already exists, we show the initial image
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                    // Submit button with options - active and inactive
                    // Registered as status, required
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                    {/* Submit Buttom */}
                </Button>
            </div>
        </form>
    );
}

export default PostForm